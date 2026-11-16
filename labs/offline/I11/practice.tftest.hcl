# Prueba específica de I11: Pipeline de pull requests
# No utiliza cuenta cloud; runner state temporal.
run "i11_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "bloqueado"
    error_message = "I11: la competencia IaC no produce el valor esperado"
  }
}
