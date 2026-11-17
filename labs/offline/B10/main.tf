variable "etiqueta" {
  type      = string
  sensitive = true
  default   = "demo-sin-secretos"
}
resource "terraform_data" "state_demo" {
  input = var.etiqueta
}

# Evidencia de la competencia específica de B10
output "academy_evidence" {
  value = nonsensitive(terraform_data.state_demo.output)
}
