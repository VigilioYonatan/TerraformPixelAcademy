variable "approved" {
  type    = bool
  default = false
}
resource "terraform_data" "release" {
  input = var.approved ? "autorizado" : "bloqueado"
}

# Evidencia de la competencia específica de I11
output "academy_evidence" {
  value = terraform_data.release.output
}
