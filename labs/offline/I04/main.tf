resource "terraform_data" "nuevo" {
  input = "estable"
}
moved {
  from = terraform_data.viejo
  to   = terraform_data.nuevo
}

# Evidencia de la competencia específica de I04
output "academy_evidence" {
  value = terraform_data.nuevo.output
}
