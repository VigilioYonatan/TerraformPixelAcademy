resource "terraform_data" "critico" {
  input = "persistencia"
  lifecycle {
    prevent_destroy = true
  }
}

# Evidencia de la competencia específica de I05
output "academy_evidence" {
  value = terraform_data.critico.input
}
