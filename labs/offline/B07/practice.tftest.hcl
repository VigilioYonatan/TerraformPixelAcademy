# Prueba específica de B07: Grafo de dependencias
# No utiliza cuenta cloud; runner state temporal.
run "b07_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "primero"
    error_message = "B07: la competencia IaC no produce el valor esperado"
  }
}
