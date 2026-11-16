terraform {
  required_version = ">= 1.6.0"
}
resource "terraform_data" "cli" {
  input = "listo"
}

# Evidencia de la competencia específica de B02
output "academy_evidence" {
  value = terraform_data.cli.output
}
