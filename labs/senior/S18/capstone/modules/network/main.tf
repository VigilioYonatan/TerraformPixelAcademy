terraform {
  required_version = ">= 1.9.0, < 2.0.0"
}

variable "environment" { type = string }
resource "terraform_data" "network" {
  input = "${var.environment}-network"
}
output "id" { value = terraform_data.network.id }
