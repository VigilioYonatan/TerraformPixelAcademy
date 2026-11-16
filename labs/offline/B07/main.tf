resource "terraform_data" "source" {
  input = "primero"
}
resource "terraform_data" "consumer" {
  input = terraform_data.source.output
}

# Evidencia de la competencia específica de B07
output "academy_evidence" {
  value = terraform_data.consumer.output
}
