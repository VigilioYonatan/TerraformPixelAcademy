# Prueba específica de A01: Importación y refactors
# No utiliza cuenta cloud; runner state temporal.
run "a01_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "import-reviewed"
    error_message = "A01: la competencia IaC no produce el valor esperado"
  }
}
