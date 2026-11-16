variable "owner" {
  type = string
  default = "gitops"
}
resource "terraform_data" "handoff" {
  input = "workloads-managed-by-${var.owner}"
}

# Evidencia de la competencia específica de A11
output "academy_evidence" {
  value = terraform_data.handoff.output
}
