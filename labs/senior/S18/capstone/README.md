# S18 — Capstone IaC offline real (sin proveedores cloud)

Este directorio contiene un ejemplo Terraform **ejecutable localmente** (aún sin validación CLI en el entorno de empaquetado), con un módulo reusable, dos workloads `terraform_data`, variables tipadas, validaciones y dos `terraform test` con `command = plan`.

## Objetivos

1. Separar root module y módulo child.
2. Establecer etiquetas y owner estables.
3. Diferenciar dev/staging/prod sin compartir state remoto.
4. Verificar outputs/contratos antes de aprobar un plan.
5. Documentar ocho hitos de la plataforma sin fingir recursos cloud.

## Ejecución local

Requiere Terraform CLI >= 1.9, < 2.0 en PATH. No necesita credenciales AWS, Azure, GCP ni permisos cloud.

```bash
cd capstone
terraform fmt -recursive -check
terraform init -backend=false -input=false
terraform validate -no-color
terraform test -no-color
terraform plan -input=false -no-color
```

NO ejecutar `terraform apply` sobre servicios de producción. Este ejercicio puede generar state local si se ejecuta `apply`, pero no crea infraestructura cloud.

**Estado en el ZIP:** `NOT_RUN` con Terraform CLI; el código fuente no es evidencia de que estos comandos hayan pasado.

## Límites de este ejercicio

No configura backends S3, OIDC, IAM, GitHub Actions, FinOps real ni entrega GitOps. Los ocho hitos exigen documentos separados para esas decisiones; no sería seguro improvisar recursos cloud en un pack offline.

## Salida de aprendizaje

El alumno debe entregar el plan revisado, resultados CLI ejecutados por él, ocho hojas de evidencia, un ADR con alternativas y rollback, y un registro de riesgos. Nunca subir state real ni secretos al repositorio.
