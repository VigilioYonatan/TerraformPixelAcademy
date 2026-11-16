terraform {
  required_version = ">= 1.9.0, < 2.0.0"
}

variable "environment" {
  description = "Entorno lógico para practicar separación de responsabilidad."
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Solo dev, staging o prod."
  }
}

variable "project" {
  description = "Identificador no sensible del proyecto."
  type        = string
  default     = "terra-academy"
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.project))
    error_message = "Use 3 a 31 caracteres en minúsculas, números y guiones."
  }
}

locals {
  components = toset(["api", "worker"])
  owner      = "platform-team"
  labels = {
    project     = var.project
    environment = var.environment
    owner       = local.owner
  }
}

module "workload" {
  for_each    = local.components
  source      = "./modules/workload"
  name        = each.key
  environment = var.environment
  tags        = local.labels
}

output "platform_summary" {
  description = "Contrato de plataforma seguro para tests offline."
  value = {
    environment = var.environment
    project     = var.project
    owner       = local.owner
    workloads   = sort([for _, workload in module.workload : workload.full_name])
  }
}
