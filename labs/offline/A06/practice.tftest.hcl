# Prueba específica de A06: Drift y reconciliación
# No utiliza cuenta cloud; runner state temporal.
run "a06_competencia" {
  command = plan
  assert {
    condition     = output.academy_evidence == "controlado-en-git"
    error_message = "A06: la competencia IaC no produce el valor esperado"
  }
}
