variable "owner" {
  default = "platform-team"
  type = string
  validation {
    condition = length(trimspace(var.owner)) > 0
    error_message = "Owner obligatorio"
  }
}

# Evidencia de la competencia específica de I10
output "academy_evidence" {
  value = var.owner
}
