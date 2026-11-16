terraform {
  required_version = ">= 1.10.0"
}
variable "token_temporal" {
  type      = string
  sensitive = true
  ephemeral = true
  default   = "demo-no-es-credencial"
}
locals {
  ephemeral_policy = "no-secret-in-outputs"
}
# Nunca exponer var.token_temporal en outputs o resource state.

# Evidencia de la competencia específica de A03
output "academy_evidence" {
  value = local.ephemeral_policy
}
