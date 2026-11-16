variable "service" {
  type = string
  default = "web"
}
resource "terraform_data" "service" {
  input = "service-${var.service}"
}
output "service_name" {
  value = terraform_data.service.output
}

# Evidencia de la competencia específica de I12
output "academy_evidence" {
  value = terraform_data.service.output
}
