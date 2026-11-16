resource "terraform_data" "test_demo" {
  input = "seguro"
}
output "valor" {
  value = terraform_data.test_demo.output
}

# Evidencia de la competencia específica de I09
output "academy_evidence" {
  value = terraform_data.test_demo.output
}
