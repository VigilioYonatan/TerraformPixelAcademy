variable "environment" { type = string }
resource "terraform_data" "service" {
  input = "${var.environment}-service"
}
output "id" { value = terraform_data.service.id }
