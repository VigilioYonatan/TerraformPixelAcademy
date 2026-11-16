variable "environment" {
  default = "staging"
  type = string
  validation {
    condition = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Entorno no permitido"
  }
}

# Evidencia de la competencia específica de I07
output "academy_evidence" {
  value = var.environment
}
