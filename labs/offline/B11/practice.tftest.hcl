# Prueba específica de B11: Count, for_each y lifecycle
# No utiliza cuenta cloud; runner state temporal.
run "b11_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == ["dev", "staging"]
    error_message = "B11: la competencia IaC no produce el valor esperado"
  }
}
