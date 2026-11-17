locals {
  entornos = toset(["dev", "staging"])
}
resource "terraform_data" "entorno" {
  for_each = local.entornos
  input    = each.key
}

# Evidencia de la competencia específica de B11
output "academy_evidence" {
  value = sort(keys(terraform_data.entorno))
}
