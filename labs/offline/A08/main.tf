variable "cost_center" {
  default = "CC-104"
  type    = string
  validation {
    condition     = length(trimspace(var.cost_center)) >= 3
    error_message = "CostCenter requerido"
  }
}

# Evidencia de la competencia específica de A08
output "academy_evidence" {
  value = var.cost_center
}
