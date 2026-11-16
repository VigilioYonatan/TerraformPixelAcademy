# Prueba específica de B12: Proyecto final básico
# No utiliza cuenta cloud; runner state temporal.
run "b12_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "vigilio"
    error_message = "B12: la competencia IaC no produce el valor esperado"
  }
}
