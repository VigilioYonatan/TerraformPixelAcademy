# B05 — Variables y tipos

**Tema:** IaC · **Nivel:** Básico · **Modo:** CLI local sin cloud.

## Objetivo observable
Parametriza una configuración con variable, tipo y default.

## Qué se ejecuta
`main.tf` implementa el concepto específico de B05, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `terraform_data.ambiente.output` contra el resultado esperado `"dev"`.
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
Parametriza una configuración con variable, tipo y default.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
