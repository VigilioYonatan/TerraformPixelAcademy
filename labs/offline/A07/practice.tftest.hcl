# Prueba específica de A07: Reemplazo y disponibilidad
# No utiliza cuenta cloud; runner state temporal.
run "a07_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "v2"
    error_message = "A07: la competencia IaC no produce el valor esperado"
  }
}
