# Prueba específica de I12: Proyecto de módulo reusable
# No utiliza cuenta cloud; runner state temporal.
run "i12_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "service-web"
    error_message = "I12: la competencia IaC no produce el valor esperado"
  }
}
