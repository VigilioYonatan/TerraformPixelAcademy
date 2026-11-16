# A05 — Redes y rangos CIDR

**Tema:** IaC · **Nivel:** Avanzado · **Modo:** CLI local sin cloud.

## Objetivo observable
Razona sobre redes sin solapamientos.

## Qué se ejecuta
`main.tf` implementa el concepto específico de A05, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `local.subred_publica` contra el resultado esperado `"10.42.0.0/24"`.
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
Razona sobre redes sin solapamientos.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
