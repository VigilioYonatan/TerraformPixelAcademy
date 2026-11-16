# B08 — Init, fmt y validate

**Tema:** IaC · **Nivel:** Básico · **Modo:** CLI local sin cloud.

## Objetivo observable
Diferencia preparación, formato y comprobación estática.

## Qué se ejecuta
`main.tf` implementa el concepto específico de B08, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `terraform_data.validacion.output` contra el resultado esperado `"configuracion preparada"`.
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
Diferencia preparación, formato y comprobación estática.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
