# Prueba específica de I07: Entornos y capas
# No utiliza cuenta cloud; runner state temporal.
run "i07_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "staging"
    error_message = "I07: la competencia IaC no produce el valor esperado"
  }
}
