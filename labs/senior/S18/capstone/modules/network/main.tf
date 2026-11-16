variable "environment" { type = string }
resource "terraform_data" "network" {
  input = "${var.environment}-network"
}
output "id" { value = terraform_data.network.id }
