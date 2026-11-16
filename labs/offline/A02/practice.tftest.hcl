# Prueba específica de A02: Migración de backends
# No utiliza cuenta cloud; runner state temporal.
run "a02_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "prod/app/terraform.tfstate"
    error_message = "A02: la competencia IaC no produce el valor esperado"
  }
}
