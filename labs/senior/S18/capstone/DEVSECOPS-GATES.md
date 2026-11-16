# Gates DevSecOps del capstone S18

Estos gates son un procedimiento para una máquina con Terraform CLI: **ningún resultado aparece como PASS en el ZIP**.

| Gate | Comando o evidencia | Estado del paquete |
|---|---|---|
| Formato HCL | `terraform fmt -check -recursive` | NOT_RUN |
| Inicialización local | `terraform init -backend=false -input=false` | NOT_RUN |
| Validación | `terraform validate -no-color` | NOT_RUN |
| Test unitario | `terraform test -no-color` | NOT_RUN |
| Plan | `terraform plan -input=false -no-color` | NOT_RUN |
| CI y suministro | PR revisada, controles Biome, SAST y lockfile | NOT_RUN |
| Identidad cloud | Principio de privilegio mínimo y OIDC documentados, sin ejecutar aquí | NOT_RUN |
| Riesgos operativos | ADR, 8 evidencias, rollback, drift y FinOps | NOT_RUN |

No colocar tokens ni salidas que contengan secretos en los documentos de evidencia. El módulo usa `terraform_data` y no intenta conectar con proveedores cloud.
