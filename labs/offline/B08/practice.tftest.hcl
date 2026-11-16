# Prueba específica de B08: Init, fmt y validate
# No utiliza cuenta cloud; runner state temporal.
run "b08_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "configuracion preparada"
    error_message = "B08: la competencia IaC no produce el valor esperado"
  }
}
