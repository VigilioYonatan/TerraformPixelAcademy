# Simulación de convención de state, SIN configurar backend remoto.
locals {
  environment = "dev"
  component   = "network"
  state_key   = "${local.environment}/${local.component}/terraform.tfstate"
}

# Evidencia de la competencia específica de I06
output "academy_evidence" {
  value = local.state_key
}
