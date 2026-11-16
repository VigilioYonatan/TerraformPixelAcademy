# HCL usa bloques y argumentos
locals {
  region = "us-east-1"
  equipo = "plataforma"
}
output "region" {
  value = local.region
}

# Evidencia de la competencia específica de B03
output "academy_evidence" {
  value = local.region
}
