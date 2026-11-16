# Prueba específica de A11: Terraform, Helm y GitOps
# No utiliza cuenta cloud; runner state temporal.
run "a11_competencia" {
  command = apply
  assert {
    condition     = output.academy_evidence == "workloads-managed-by-gitops"
    error_message = "A11: la competencia IaC no produce el valor esperado"
  }
}
