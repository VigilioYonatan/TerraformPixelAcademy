variable "name" {
  type = string
}
variable "environment" {
  type = string
}
variable "tags" {
  type = map(string)
}

resource "terraform_data" "component" {
  input = {
    name        = var.name
    environment = var.environment
    labels      = var.tags
  }
}

output "full_name" {
  value = "${var.environment}-${var.name}"
}
output "resource_address_hint" {
  description = "Solo orientación para aprender direcciones de módulos."
  value       = "terraform_data.component"
}
