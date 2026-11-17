variable "ambiente" {
  type    = string
  default = "dev"
}
resource "terraform_data" "ambiente" {
  input = var.ambiente
}

# Evidencia de la competencia específica de B05
output "academy_evidence" {
  value = terraform_data.ambiente.output
}
