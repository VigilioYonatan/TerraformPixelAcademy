# B01 · tu primera declaración local
resource "terraform_data" "idea" {
  input = "infraestructura como codigo"
}
output "concepto" {
  value = terraform_data.idea.output
}

# Evidencia de la competencia específica de B01
output "academy_evidence" {
  value = terraform_data.idea.output
}
