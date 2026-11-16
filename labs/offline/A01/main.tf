# Para practicar refactor seguro sin importar recursos AWS ajenos.
resource "terraform_data" "existente" {
  input = "import-reviewed"
}
# El ejemplo AWS import está separado en reference-cloud.tf.txt.

# Evidencia de la competencia específica de A01
output "academy_evidence" {
  value = terraform_data.existente.output
}
