resource "terraform_data" "baseline" {
  input = "controlado-en-git"
  lifecycle {
    prevent_destroy = true
  }
}

# Evidencia de la competencia específica de A06
output "academy_evidence" {
  value = terraform_data.baseline.output
}
