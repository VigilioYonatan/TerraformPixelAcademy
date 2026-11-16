# I03 — Data sources y referencias

**Tema:** IaC · **Nivel:** Intermedio · **Modo:** CLI local sin cloud.

## Objetivo observable
Diferencia consultar recursos existentes y gestionarlos.

## Qué se ejecuta
`main.tf` implementa el concepto específico de I03, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `terraform_data.consulta.output` contra el resultado esperado `"api"`.
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
Diferencia consultar recursos existentes y gestionarlos.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
