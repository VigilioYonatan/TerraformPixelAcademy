# Prueba específica de B09: Plan, apply y destroy
# No utiliza cuenta cloud; runner state temporal.
run "b09_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "revision necesaria"
    error_message = "B09: la competencia IaC no produce el valor esperado"
  }
}
