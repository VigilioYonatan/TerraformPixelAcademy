terraform {
  required_version = ">= 1.9.0, < 2.0.0"
}

variable "environment" { type = string }
resource "terraform_data" "data" {
  input = "${var.environment}-data"
}
output "id" { value = terraform_data.data.id }
