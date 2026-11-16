# Prueba específica de I05: Lectura profesional de planes
# No utiliza cuenta cloud; runner state temporal.
run "i05_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "persistencia"
    error_message = "I05: la competencia IaC no produce el valor esperado"
  }
}
