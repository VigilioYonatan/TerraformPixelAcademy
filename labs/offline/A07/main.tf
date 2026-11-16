resource "terraform_data" "web" {
  input = "v2"
  lifecycle {
    create_before_destroy = true
  }
}

# Evidencia de la competencia específica de A07
output "academy_evidence" {
  value = terraform_data.web.output
}
