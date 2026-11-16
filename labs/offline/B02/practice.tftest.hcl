# Prueba específica de B02: Instalación y CLI
# No utiliza cuenta cloud; runner state temporal.
run "b02_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "listo"
    error_message = "B02: la competencia IaC no produce el valor esperado"
  }
}
