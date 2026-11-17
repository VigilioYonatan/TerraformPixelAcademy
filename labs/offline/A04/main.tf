variable "entorno_autorizado" {
  default = "staging"
  type    = string
  validation {
    condition     = contains(["staging", "prod"], var.entorno_autorizado)
    error_message = "Entorno no autorizado"
  }
}

# Evidencia de la competencia específica de A04
output "academy_evidence" {
  value = var.entorno_autorizado
}
