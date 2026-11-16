terraform {
  required_version = ">= 1.6.0, < 2.0.0"
}
# El ejemplo de required_providers externo está separado en reference-cloud.tf.txt.
resource "terraform_data" "version_guard" {
  input = "provider-isolation"
}

# Evidencia de la competencia específica de I02
output "academy_evidence" {
  value = terraform_data.version_guard.output
}
