resource "terraform_data" "origen" {
  input = "api"
}
resource "terraform_data" "consulta" {
  input = terraform_data.origen.output
}

# Evidencia de la competencia específica de I03
output "academy_evidence" {
  value = terraform_data.consulta.output
}
