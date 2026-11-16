# Prueba específica de I01: Diseño de módulos
# No utiliza cuenta cloud; runner state temporal.
run "i01_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "academy"
    error_message = "I01: la competencia IaC no produce el valor esperado"
  }
}
