# Prueba específica de I08: Outputs entre módulos
# No utiliza cuenta cloud; runner state temporal.
run "i08_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "vpc-demo"
    error_message = "I08: la competencia IaC no produce el valor esperado"
  }
}
