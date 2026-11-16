# Prueba específica de I03: Data sources y referencias
# No utiliza cuenta cloud; runner state temporal.
run "i03_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "api"
    error_message = "I03: la competencia IaC no produce el valor esperado"
  }
}
