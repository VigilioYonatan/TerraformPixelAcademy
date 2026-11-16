# Prueba específica de I10: Lint, scanning y policy
# No utiliza cuenta cloud; runner state temporal.
run "i10_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "platform-team"
    error_message = "I10: la competencia IaC no produce el valor esperado"
  }
}
