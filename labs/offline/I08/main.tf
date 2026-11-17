resource "terraform_data" "red" {
  input = "vpc-demo"
}
output "network_id" {
  value       = terraform_data.red.id
  description = "Identificador de ejemplo de red"
}

# Evidencia de la competencia específica de I08
output "academy_evidence" {
  value = terraform_data.red.output
}
