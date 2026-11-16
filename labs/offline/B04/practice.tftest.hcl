# Prueba específica de B04: Tu primer recurso
# No utiliza cuenta cloud; runner state temporal.
run "b04_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "Hola, Terraform"
    error_message = "B04: la competencia IaC no produce el valor esperado"
  }
}
