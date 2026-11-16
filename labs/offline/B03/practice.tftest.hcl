# Prueba específica de B03: Sintaxis HCL
# No utiliza cuenta cloud; runner state temporal.
run "b03_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "us-east-1"
    error_message = "B03: la competencia IaC no produce el valor esperado"
  }
}
