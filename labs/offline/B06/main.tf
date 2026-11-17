variable "proyecto" {
  type    = string
  default = "academy"
}
locals {
  nombre = "${var.proyecto}-dev"
}
output "nombre" {
  value = local.nombre
}

# Evidencia de la competencia específica de B06
output "academy_evidence" {
  value = local.nombre
}
