# Prueba específica de A03: Secretos y valores ephemeral
# No utiliza cuenta cloud; runner state temporal.
run "a03_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "no-secret-in-outputs"
    error_message = "A03: la competencia IaC no produce el valor esperado"
  }
}
