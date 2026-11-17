variable "entorno" {
  default = "dev"
  type    = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.entorno)
    error_message = "Entorno desconocido"
  }
}
locals {
  namespace = "app-${var.entorno}"
}

# Evidencia de la competencia específica de A10
output "academy_evidence" {
  value = local.namespace
}
