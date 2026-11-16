# Prueba específica de A10: AWS multiambiente
# No utiliza cuenta cloud; runner state temporal.
run "a10_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "app-dev"
    error_message = "A10: la competencia IaC no produce el valor esperado"
  }
}
