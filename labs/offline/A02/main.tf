# Backend S3 se documenta en reference-cloud.tf.txt (NO se inicializa aquí).
locals {
  environment    = "prod"
  service        = "app"
  target_backend = "${local.environment}/${local.service}/terraform.tfstate"
}

# Evidencia de la competencia específica de A02
output "academy_evidence" {
  value = local.target_backend
}
