terraform {
  required_version = ">= 1.6.0"
}
resource "terraform_data" "validacion" {
  input = "configuracion preparada"
}

# Evidencia de la competencia específica de B08
output "academy_evidence" {
  value = terraform_data.validacion.output
}
