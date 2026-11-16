# Prueba específica de I02: Versiones y lockfile
# No utiliza cuenta cloud; runner state temporal.
run "i02_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "provider-isolation"
    error_message = "I02: la competencia IaC no produce el valor esperado"
  }
}
