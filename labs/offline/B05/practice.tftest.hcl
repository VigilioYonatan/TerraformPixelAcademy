# Prueba específica de B05: Variables y tipos
# No utiliza cuenta cloud; runner state temporal.
run "b05_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "dev"
    error_message = "B05: la competencia IaC no produce el valor esperado"
  }
}
