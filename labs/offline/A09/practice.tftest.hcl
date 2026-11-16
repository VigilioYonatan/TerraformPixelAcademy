# Prueba específica de A09: FinOps para Terraform
# No utiliza cuenta cloud; runner state temporal.
run "a09_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == 2
    error_message = "A09: la competencia IaC no produce el valor esperado"
  }
}
