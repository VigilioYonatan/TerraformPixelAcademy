#!/usr/bin/env bash
# Evidence-producing CLI verification: real Terraform executions, never assume success.
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORT_DIR="${REPORT_DIR:-$ROOT/terraform-verification-results}"
if ! command -v terraform >/dev/null 2>&1; then
  printf 'NOT_RUN: Terraform CLI is missing. Install from an official source first.\n' >&2
  exit 3
fi
mkdir -p "$REPORT_DIR"
terraform version > "$REPORT_DIR/terraform-version.txt" 2>&1
printf 'Run: %s\n' "$(date -u +%FT%TZ)" > "$REPORT_DIR/SUMMARY.txt"
printf 'Runner: local; cloud credentials not requested; 36 terraform_data labs and S18.\n' >> "$REPORT_DIR/SUMMARY.txt"
pass=0;fail=0
check_lab(){
  local id="$1"
  local directory="$2"
  local logfile="$REPORT_DIR/${id}.log"
  local status='PASS' sandbox
  printf '%s: ' "$id"
  sandbox="$(mktemp -d)" || { printf 'FAIL: no se pudo crear sandbox\n'; fail=$((fail+1));return; }
  if ! cp -R "$directory/." "$sandbox/";then
    status='FAIL'
    printf 'FAIL: no se pudo copiar el laboratorio\n' > "$logfile"
  else
    (
      cd "$sandbox"
      export TF_IN_AUTOMATION=1
      echo "Verifying $id on an isolated temporary COPY. Project sources are not changed."
      if ! terraform fmt -check -recursive -no-color >/dev/null 2>&1; then
        echo 'SOURCE_FORMAT_FAIL: la fuente original no pasa terraform fmt -check.'
        exit 27
      fi
      terraform fmt -recursive -no-color
      terraform init -backend=false -input=false -no-color
      terraform validate -no-color
      terraform test -no-color
    ) > "$logfile" 2>&1 || status='FAIL'
  fi
  # Only this runner-owned temporary folder may be removed; all project sources remain intact.
  rm -rf -- "$sandbox"
  if [[ "$status" == 'PASS' ]]; then pass=$((pass+1));else fail=$((fail+1));fi
  printf '%s\n' "$status"
  printf '%s | %s | %s\n' "$id" "$status" "$logfile" >> "$REPORT_DIR/SUMMARY.txt"
}
for prefix in B I A;do
 for i in $(seq -w 1 12);do
  id="$prefix$i";check_lab "$id" "$ROOT/labs/offline/$id"
 done
done
check_lab S18 "$ROOT/labs/senior/S18/capstone"
printf '\nFinished: PASS=%s FAIL=%s (expected 37)\n' "$pass" "$fail" | tee -a "$REPORT_DIR/SUMMARY.txt"
NODE_BIN="${NODE_BINARY:-$(command -v node || command -v node.exe || echo node)}"
"$NODE_BIN" "$ROOT/scripts/create-evidence-manifest.mjs" "$REPORT_DIR"
if [[ "$fail" -gt 0 ]];then exit 1;fi
