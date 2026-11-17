variable "equipo" {
  type    = string
  default = "vigilio"
}
resource "terraform_data" "proyecto" {
  input = var.equipo
}
output "equipo" {
  value = terraform_data.proyecto.output
}

# Evidencia de la competencia específica de B12
output "academy_evidence" {
  value = terraform_data.proyecto.output
}
