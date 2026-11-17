variable "environment" {
  type    = string
  default = "staging"
}
resource "terraform_data" "deployment" {
  input = "${var.environment}-reviewed"
  lifecycle {
    prevent_destroy = true
  }
}
output "id" {
  value = terraform_data.deployment.id
}

# Evidencia de la competencia específica de A12
output "academy_evidence" {
  value = terraform_data.deployment.input
}
