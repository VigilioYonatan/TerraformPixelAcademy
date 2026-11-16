# A07 — Reemplazo y disponibilidad

**Tema:** IaC · **Nivel:** Avanzado · **Modo:** CLI local sin cloud.

## Objetivo observable
Evalúa lifecycle, provider y costos temporales.

## Qué se ejecuta
`main.tf` implementa el concepto específico de A07, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `terraform_data.web.output` contra el resultado esperado `"v2"`.
Las lecciones que enseñan backend, importación o providers de cloud mantienen ese ejemplo en `reference-cloud.tf.txt`, **no ejecutable por defecto**.

## Ejecución local
```sh
terraform fmt
terraform fmt -check
terraform init -backend=false
terraform validate
terraform test
```
Terraform CLI >= 1.10 para A03; >= 1.6 para los demás. Las pruebas usan `apply` únicamente sobre recursos incorporados `terraform_data`, variables y `locals`, sin dependencias cloud.

## Ejercicio
Evalúa lifecycle, provider y costos temporales.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
