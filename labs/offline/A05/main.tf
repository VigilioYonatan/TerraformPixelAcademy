variable "red" {
  type = string
  default = "10.42.0.0/16"
}
locals {
  subred_publica = cidrsubnet(var.red, 8, 0)
  subred_privada = cidrsubnet(var.red, 8, 1)
}

# Evidencia de la competencia específica de A05
output "academy_evidence" {
  value = local.subred_publica
}
