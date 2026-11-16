# Prueba específica de I09: Terraform test y mocks
# No utiliza cuenta cloud; runner state temporal.
run "i09_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "seguro"
    error_message = "I09: la competencia IaC no produce el valor esperado"
  }
}
