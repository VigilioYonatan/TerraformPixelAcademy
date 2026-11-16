# Real Terraform CLI verification on PowerShell. 37 local-only exercises.
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
  Write-Error 'NOT_RUN: Terraform CLI no esta disponible en PATH.'
  exit 3
}
$Report = Join-Path $Root 'terraform-verification-results'
New-Item -Type Directory -Path $Report -Force | Out-Null
terraform version | Out-File -FilePath (Join-Path $Report 'terraform-version.txt') -Encoding utf8
$summary = [System.Collections.Generic.List[string]]::new()
$summary.Add("Run UTC: $([DateTime]::UtcNow.ToString('o'))")
$fail = 0
$pass = 0
$ids = @()
foreach ($prefix in @('B','I','A')) { 1..12 | ForEach-Object {$ids += ('{0}{1:00}' -f $prefix,$_)} }
$ids += 'S18'
foreach ($id in $ids) {
  if ($id -eq 'S18') {$dir = Join-Path $Root 'labs/senior/S18/capstone'}
  else {$dir = Join-Path $Root "labs/offline/$id"}
  $log = Join-Path $Report "$id.log"
  $result = 'PASS'
  # Execute only on a runner-owned temporary copy. Never rewrite the student's sources.
  $sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ("terrapixel-" + [guid]::NewGuid().ToString('N'))
  New-Item -Type Directory -Path $sandbox -Force | Out-Null
  try {
    Copy-Item -Path (Join-Path $dir '*') -Destination $sandbox -Recurse -Force
    Push-Location $sandbox
    try {
      "Verifying $id in isolated COPY; originals not modified." | Out-File -FilePath $log -Encoding utf8
      & terraform fmt -check -recursive -no-color 2>&1 | Out-Null
      if ($LASTEXITCODE -ne 0) {
        "SOURCE_FORMAT_FAIL: fuente original no pasa terraform fmt -check." | Out-File -FilePath $log -Append -Encoding utf8
        throw "Terraform formatting check failed"
      }
      $commands = @(
        @('fmt','-recursive','-no-color'),
        @('init','-backend=false','-input=false','-no-color'),
        @('validate','-no-color'),
        @('test','-no-color')
      )
      foreach ($arguments in $commands) {
        & terraform @arguments 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
        if ($LASTEXITCODE -ne 0) {throw "terraform $($arguments[0]) failed ($LASTEXITCODE)"}
      }
    } finally { Pop-Location }
  } catch {
    $result = 'FAIL'
    $_ | Out-File -FilePath $log -Append -Encoding utf8
  } finally {
    if (Test-Path $sandbox) { Remove-Item -LiteralPath $sandbox -Force -Recurse }
  }
  if ($result -eq 'PASS') {$pass++}else {$fail++}
  $summary.Add("$id | $result | $log")
  Write-Host "$id $result"
}
$summary.Add("Finished: PASS=$pass FAIL=$fail (expected 37)")
$summary | Out-File -FilePath (Join-Path $Report 'SUMMARY.txt') -Encoding utf8
& node (Join-Path $Root "scripts/create-evidence-manifest.mjs") $Report
if ($LASTEXITCODE -ne 0) { exit 2 }
if ($fail -gt 0) {exit 1}
