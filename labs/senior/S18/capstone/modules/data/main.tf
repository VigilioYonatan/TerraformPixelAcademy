variable "environment" { type = string }
resource "terraform_data" "data" {
  input = "${var.environment}-data"
}
output "id" { value = terraform_data.data.id }
