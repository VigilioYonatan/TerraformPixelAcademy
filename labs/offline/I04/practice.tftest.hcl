# Prueba específica de I04: Direcciones y moved blocks
# No utiliza cuenta cloud; runner state temporal.
run "i04_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "estable"
    error_message = "I04: la competencia IaC no produce el valor esperado"
  }
}
