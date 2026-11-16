# Prueba específica de B01: ¿Qué es Infrastructure as Code?
# No utiliza cuenta cloud; runner state temporal.
run "b01_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "infraestructura como codigo"
    error_message = "B01: la competencia IaC no produce el valor esperado"
  }
}
