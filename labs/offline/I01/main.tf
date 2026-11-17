variable "nombre" {
  default = "academy"
  type    = string
}
resource "terraform_data" "modulo" {
  input = var.nombre
}
output "id" {
  value = terraform_data.modulo.id
}

# Evidencia de la competencia específica de I01
output "academy_evidence" {
  value = terraform_data.modulo.output
}
