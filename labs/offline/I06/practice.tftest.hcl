# Prueba específica de I06: Remote state y locking
# No utiliza cuenta cloud; runner state temporal.
run "i06_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "dev/network/terraform.tfstate"
    error_message = "I06: la competencia IaC no produce el valor esperado"
  }
}
