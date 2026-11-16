# Prueba específica de A12: Proyecto avanzado
# No utiliza cuenta cloud; runner state temporal.
run "a12_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "staging-reviewed"
    error_message = "A12: la competencia IaC no produce el valor esperado"
  }
}
