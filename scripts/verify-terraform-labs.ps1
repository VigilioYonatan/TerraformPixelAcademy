# Real Terraform CLI verification on PowerShell. 37 local-only exercises.
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
  [Console]::Error.WriteLine('NOT_RUN: Terraform CLI is missing. Install from an official source first.')
  exit 3
}
$Report = if ($env:REPORT_DIR) { $env:REPORT_DIR } else { Join-Path $Root 'terraform-verification-results' }
New-Item -Type Directory -Path $Report -Force | Out-Null
$prevAutomation = $env:TF_IN_AUTOMATION
$env:TF_IN_AUTOMATION = '1'
try {
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $verOut = & terraform version 2>&1
  $verExit = $LASTEXITCODE
  $ErrorActionPreference = $prevEap
  if ($verExit -ne 0) {
    [Console]::Error.WriteLine("FAIL: terraform version devolvio codigo $verExit")
    exit 1
  }
  ($verOut | Out-String).TrimEnd() | Set-Content -LiteralPath (Join-Path $Report 'terraform-version.txt') -Encoding utf8
  $summary = [System.Collections.Generic.List[string]]::new()
  $summary.Add("Run UTC: $([DateTime]::UtcNow.ToString('o'))")
  $summary.Add('Runner: local; cloud credentials not requested; 36 terraform_data labs and S18.')
  $fail = 0
  $pass = 0
  $ids = @()
  foreach ($prefix in @('B','I','A')) { 1..12 | ForEach-Object { $ids += ('{0}{1:00}' -f $prefix, $_) } }
  $ids += 'S18'
  foreach ($id in $ids) {
    if ($id -eq 'S18') { $dir = Join-Path $Root 'labs/senior/S18/capstone' }
    else { $dir = Join-Path $Root "labs/offline/$id" }
    $log = Join-Path $Report "$id.log"
    $result = 'PASS'
    # Execute only on a runner-owned temporary copy. Never rewrite the student's sources.
    $sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('terrapixel-' + [guid]::NewGuid().ToString('N'))
    New-Item -Type Directory -Path $sandbox -Force | Out-Null
    $logLines = [System.Collections.Generic.List[string]]::new()
    $logLines.Add("Verifying $id on an isolated temporary COPY. Project sources are not changed.")
    try {
      Copy-Item -Path (Join-Path $dir '*') -Destination $sandbox -Recurse -Force
      Push-Location $sandbox
      try {
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        $fmtCheck = & terraform fmt -check -recursive -no-color 2>&1
        $fmtExit = $LASTEXITCODE
        $ErrorActionPreference = $prevEap
        if ($fmtExit -ne 0) {
          if ($fmtCheck) { $logLines.Add(($fmtCheck | Out-String).TrimEnd()) }
          $logLines.Add('SOURCE_FORMAT_FAIL: la fuente original no pasa terraform fmt -check.')
          throw 'Terraform formatting check failed'
        }
        $commands = @(
          @('fmt','-recursive','-no-color'),
          @('init','-backend=false','-input=false','-no-color'),
          @('validate','-no-color'),
          @('test','-no-color')
        )
        foreach ($arguments in $commands) {
          $prevEap = $ErrorActionPreference
          $ErrorActionPreference = 'Continue'
          $cmdOut = & terraform @arguments 2>&1
          $cmdExit = $LASTEXITCODE
          $ErrorActionPreference = $prevEap
          if ($cmdOut) { $logLines.Add(($cmdOut | Out-String).TrimEnd()) }
          if ($cmdExit -ne 0) { throw "terraform $($arguments[0]) failed ($cmdExit)" }
        }
      } finally { Pop-Location }
    } catch {
      $result = 'FAIL'
      $logLines.Add($_.Exception.Message)
    } finally {
      [System.IO.File]::WriteAllText($log, ($logLines -join "`n") + "`n", [System.Text.UTF8Encoding]::new($false))
      if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Force -Recurse }
    }
    if ($result -eq 'PASS') { $pass++ } else { $fail++ }
    $summary.Add("$id | $result | $log")
    Write-Host "${id}: $result"
  }
  $finalLine = "Finished: PASS=$pass FAIL=$fail (expected 37)"
  $summary.Add($finalLine)
  [System.IO.File]::WriteAllText((Join-Path $Report 'SUMMARY.txt'), ($summary -join "`n") + "`n", [System.Text.UTF8Encoding]::new($false))
  Write-Host ''
  Write-Host $finalLine
  $NodeBin = if ($env:NODE_BINARY) { $env:NODE_BINARY } else { 'node' }
  & $NodeBin (Join-Path $Root 'scripts/create-evidence-manifest.mjs') $Report
  if ($LASTEXITCODE -ne 0) { exit 2 }
  if ($fail -gt 0) { exit 1 }
} finally {
  $env:TF_IN_AUTOMATION = $prevAutomation
}
