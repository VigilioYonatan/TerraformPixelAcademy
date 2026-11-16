resource "terraform_data" "ciclo" {
  input = "revision necesaria"
  lifecycle {
    prevent_destroy = true
  }
}

# Evidencia de la competencia específica de B09
output "academy_evidence" {
  value = terraform_data.ciclo.output
}
