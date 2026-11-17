variable "replicas" {
  type    = number
  default = 2
  validation {
    condition     = var.replicas >= 1 && var.replicas <= 5
    error_message = "Replicas fuera de presupuesto"
  }
}

# Evidencia de la competencia específica de A09
output "academy_evidence" {
  value = var.replicas
}
