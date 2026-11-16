# Prueba específica de A08: Policy as Code
# No utiliza cuenta cloud; runner state temporal.
run "a08_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "CC-104"
    error_message = "A08: la competencia IaC no produce el valor esperado"
  }
}
