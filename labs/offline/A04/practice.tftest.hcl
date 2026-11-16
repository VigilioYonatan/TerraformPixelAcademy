# Prueba específica de A04: IAM mínimo y OIDC
# No utiliza cuenta cloud; runner state temporal.
run "a04_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "staging"
    error_message = "A04: la competencia IaC no produce el valor esperado"
  }
}
