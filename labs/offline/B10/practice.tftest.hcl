# Prueba específica de B10: Terraform state y secretos
# No utiliza cuenta cloud; runner state temporal.
run "b10_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "demo-sin-secretos"
    error_message = "B10: la competencia IaC no produce el valor esperado"
  }
}
