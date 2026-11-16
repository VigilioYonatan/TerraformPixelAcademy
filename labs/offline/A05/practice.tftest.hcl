# Prueba específica de A05: Redes y rangos CIDR
# No utiliza cuenta cloud; runner state temporal.
run "a05_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "10.42.0.0/24"
    error_message = "A05: la competencia IaC no produce el valor esperado"
  }
}
