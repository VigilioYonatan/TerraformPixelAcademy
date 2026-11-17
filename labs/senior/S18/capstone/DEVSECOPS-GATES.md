# Gates DevSecOps del capstone S18

Registro honesto de controles ejecutados sobre el paquete multi-módulo offline (`terraform_data`) frente a controles que siguen requiriendo sandbox cloud o aprobación humana:

| Gate | Comando o evidencia | Estado verificado |
|---|---|---|
| Formato HCL | `terraform fmt -check -recursive` (`Terraform v1.10.5`) | PASS (`2026-11-16`, copia temporal aislada) |
| Inicialización local | `terraform init -backend=false -input=false` (`Terraform v1.10.5`) | PASS (`2026-11-16`, copia temporal aislada) |
| Validación | `terraform validate -no-color` (`Terraform v1.10.5`) | PASS (`2026-11-16`, copia temporal aislada) |
| Test unitario HCL | `terraform test -no-color` (`tests/capstone.tftest.hcl`) | PASS (`2026-11-16`, copia temporal aislada) |
| Linter y seguridad IaC | `tflint --recursive` (`v0.66.0`), `trivy config` (`v0.76.2`), `conftest verify/test` (`v0.71.1`) | PASS (`0` hallazgos HIGH/CRITICAL) |
| Plan autenticado cloud | `terraform plan` contra cuenta sandbox cloud | NOT_RUN |
| Identidad cloud real | Federación OIDC IAM en cuenta AWS real | NOT_RUN |
| Aprobación humana de ADR | Revisión de arquitectura y los 8 hitos por pares/owners | NOT_RUN |

No colocar tokens ni salidas que contengan secretos en los documentos de evidencia. El módulo usa `terraform_data` y no intenta conectar con proveedores cloud.
