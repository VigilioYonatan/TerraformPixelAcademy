# Pruebas locales del ejemplo sintético S18. No requieren credenciales cloud.
run "development_contract" {
  command = plan
  assert {
    condition     = output.platform_summary.environment == "dev"
    error_message = "El entorno por defecto debe ser dev."
  }
  assert {
    condition     = length(output.platform_summary.workloads) == 2
    error_message = "Deben existir api y worker."
  }
  assert {
    condition     = contains(output.platform_summary.workloads, "dev-api")
    error_message = "Falta el contrato del workload api."
  }
}
run "production_contract" {
  command = plan
  variables {
    environment = "prod"
  }
  assert {
    condition     = contains(output.platform_summary.workloads, "prod-worker")
    error_message = "La parametrización prod no llegó al módulo."
  }
  assert {
    condition     = output.platform_summary.owner == "platform-team"
    error_message = "Debe existir owner explícito."
  }
}
