terraform {
  required_version = ">= 1.6.0"
}
resource "terraform_data" "demo" {
  input = "Hola, Terraform"
}
output "mensaje" {
  value = terraform_data.demo.output
}

# Evidencia de la competencia específica de B04
output "academy_evidence" {
  value = terraform_data.demo.output
}
