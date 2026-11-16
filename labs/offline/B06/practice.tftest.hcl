# Prueba específica de B06: Locals y outputs
# No utiliza cuenta cloud; runner state temporal.
run "b06_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "academy-dev"
    error_message = "B06: la competencia IaC no produce el valor esperado"
  }
}
