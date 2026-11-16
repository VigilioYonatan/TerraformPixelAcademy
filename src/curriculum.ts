export interface Lesson { id: string; level: string; title: string; subtitle: string; concept: string; objective: string; example: string; starter: string; required: string[]; missing: string; question: string; options: string[]; correct: number; tip: string; warning: string; category: string; xp: number }
export interface Track { title: string; from: string; to: string; description: string; icon: string }
export const lessons: Lesson[] = [
  {
    "id": "B01",
    "level": "Básico",
    "title": "¿Qué es Infrastructure as Code?",
    "subtitle": "Distingue la infraestructura declarativa de una secuencia manual de operaciones.",
    "concept": "Terraform describe el estado deseado de la infraestructura; compara configuración y estado para proponer cambios. Un repositorio permite revisar decisiones y reproducir entornos. No reemplaza la operación, las autorizaciones ni la supervisión de recursos.",
    "objective": "Distingue la infraestructura declarativa de una secuencia manual de operaciones.",
    "example": "# B01 · tu primera declaración local\nresource \"terraform_data\" \"idea\" {\n  input = \"infraestructura como codigo\"\n}\noutput \"concepto\" {\n  value = terraform_data.idea.output\n}\n",
    "starter": "# B01 · tu primera declaración local\nresource \"terraform_data\" \"idea\" {\n# TODO: completa la configuración aquí\n}\noutput \"concepto\" {\n  value = terraform_data.idea.output\n}\n",
    "required": [
      "resource\\s+\"terraform_data\"\\s+\"idea\"",
      "input\\s*=\\s*\"infraestructura como codigo\""
    ],
    "missing": "  input = \"infraestructura como codigo\"",
    "question": "¿Qué es principalmente Terraform?",
    "options": [
      "Un orquestador de contenedores",
      "Una herramienta declarativa de IaC",
      "Un sistema de monitoreo"
    ],
    "correct": 1,
    "tip": "Declara el estado deseado en HCL; no escribas un script de clics.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B02",
    "level": "Básico",
    "title": "Instalación y CLI",
    "subtitle": "Reconoce versión, init, validate y plan sin confundir sus responsabilidades.",
    "concept": "La CLI real se ejecuta en tu equipo, no dentro de esta web. `terraform version` comprueba la instalación; `init` prepara plugins y backend; `validate` revisa la configuración; `plan` compara el estado conocido con el código. Los resultados web son solamente verificaciones educativas.",
    "objective": "Reconoce versión, init, validate y plan sin confundir sus responsabilidades.",
    "example": "terraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"cli\" {\n  input = \"listo\"\n}\n",
    "starter": "terraform {\n# TODO: completa la configuración aquí\n}\nresource \"terraform_data\" \"cli\" {\n  input = \"listo\"\n}\n",
    "required": [
      "required_version\\s*=\\s*\">=\\s*1\\.6\\.0\""
    ],
    "missing": "  required_version = \">= 1.6.0\"",
    "question": "¿Qué comando prepara los proveedores del módulo?",
    "options": [
      "terraform plan",
      "terraform init",
      "terraform output"
    ],
    "correct": 1,
    "tip": "Anota una restricción explícita de versión y recuerda ejecutar init localmente.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B03",
    "level": "Básico",
    "title": "Sintaxis HCL",
    "subtitle": "Aprende bloques, argumentos, expresiones y comentarios en HCL.",
    "concept": "HCL separa bloques y argumentos. Los bloques pueden tener etiquetas y un cuerpo `{}`; las expresiones producen valores. Las referencias entre recursos son expresiones, no textos con nombres copiados. Usa terraform fmt para un formato consistente.",
    "objective": "Aprende bloques, argumentos, expresiones y comentarios en HCL.",
    "example": "# HCL usa bloques y argumentos\nlocals {\n  region = \"us-east-1\"\n  equipo = \"plataforma\"\n}\noutput \"region\" {\n  value = local.region\n}\n",
    "starter": "# HCL usa bloques y argumentos\nlocals {\n# TODO: completa la configuración aquí\n  equipo = \"plataforma\"\n}\noutput \"region\" {\n  value = local.region\n}\n",
    "required": [
      "locals\\s*\\{",
      "region\\s*=\\s*\"us-east-1\""
    ],
    "missing": "  region = \"us-east-1\"",
    "question": "¿Cómo accedes a un local llamado region?",
    "options": [
      "var.region",
      "local.region",
      "locals.region"
    ],
    "correct": 1,
    "tip": "Usa `local.region`, no `locals.region`.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B04",
    "level": "Básico",
    "title": "Tu primer recurso",
    "subtitle": "Construye un recurso terraform_data y expón su resultado.",
    "concept": "El recurso incorporado `terraform_data` permite practicar el ciclo de vida sin configurar un proveedor cloud. `output` expone valores resultantes y puede estar desconocido antes del primer apply. El motor web solo verifica reglas; para probar de verdad utiliza el pack local.",
    "objective": "Construye un recurso terraform_data y expón su resultado.",
    "example": "terraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"demo\" {\n  input = \"Hola, Terraform\"\n}\noutput \"mensaje\" {\n  value = terraform_data.demo.output\n}\n",
    "starter": "terraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"demo\" {\n# TODO: completa la configuración aquí\n}\noutput \"mensaje\" {\n  value = terraform_data.demo.output\n}\n",
    "required": [
      "resource\\s+\"terraform_data\"\\s+\"demo\"",
      "input\\s*=\\s*\"Hola, Terraform\"",
      "value\\s*=\\s*terraform_data\\.demo\\.output"
    ],
    "missing": "  input = \"Hola, Terraform\"",
    "question": "¿Dónde corre Terraform CLI real en esta entrega?",
    "options": [
      "En el navegador",
      "En el equipo del alumno o CI",
      "En una Lambda oculta"
    ],
    "correct": 1,
    "tip": "Inserta input dentro de terraform_data.demo, respetando el output existente.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B05",
    "level": "Básico",
    "title": "Variables y tipos",
    "subtitle": "Parametriza una configuración con variable, tipo y default.",
    "concept": "Las variables declaran una interfaz de entrada para el módulo. Los tipos previenen usos incorrectos y los defaults son opcionales. Nunca guardes credenciales en archivos `.tfvars` que subas a Git.",
    "objective": "Parametriza una configuración con variable, tipo y default.",
    "example": "variable \"ambiente\" {\n  type = string\n  default = \"dev\"\n}\nresource \"terraform_data\" \"ambiente\" {\n  input = var.ambiente\n}\n",
    "starter": "variable \"ambiente\" {\n# TODO: completa la configuración aquí\n  default = \"dev\"\n}\nresource \"terraform_data\" \"ambiente\" {\n  input = var.ambiente\n}\n",
    "required": [
      "variable\\s+\"ambiente\"",
      "type\\s*=\\s*string",
      "input\\s*=\\s*var\\.ambiente"
    ],
    "missing": "  type = string",
    "question": "¿Cómo referencias una variable de entrada?",
    "options": [
      "var.ambiente",
      "local.ambiente",
      "input.ambiente"
    ],
    "correct": 0,
    "tip": "Declara el tipo `string` en el bloque variable.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B06",
    "level": "Básico",
    "title": "Locals y outputs",
    "subtitle": "Reutiliza expresiones sin repetir valores y publica salidas seguras.",
    "concept": "Los valores locales simplifican expresiones derivadas; los outputs sirven como interfaz para consumidores y CLI. Las salidas sensibles requieren protección real del estado, no solo ocultarlas visualmente.",
    "objective": "Reutiliza expresiones sin repetir valores y publica salidas seguras.",
    "example": "variable \"proyecto\" {\n  type = string\n  default = \"academy\"\n}\nlocals {\n  nombre = \"${var.proyecto}-dev\"\n}\noutput \"nombre\" {\n  value = local.nombre\n}\n",
    "starter": "variable \"proyecto\" {\n  type = string\n  default = \"academy\"\n}\nlocals {\n# TODO: completa la configuración aquí\n}\noutput \"nombre\" {\n  value = local.nombre\n}\n",
    "required": [
      "locals\\s*\\{",
      "nombre\\s*=\\s*\"\\$\\{var\\.proyecto\\}-dev\""
    ],
    "missing": "  nombre = \"${var.proyecto}-dev\"",
    "question": "¿Cuál es la referencia a un local?",
    "options": [
      "locals.nombre",
      "local.nombre",
      "output.nombre"
    ],
    "correct": 1,
    "tip": "Usa una interpolación para derivar el nombre.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B07",
    "level": "Básico",
    "title": "Grafo de dependencias",
    "subtitle": "Identifica el orden implícito a partir de referencias.",
    "concept": "Terraform construye un grafo de dependencias; si `consumer` referencia `source.output`, se crea una arista implícita. `depends_on` se reserva para relaciones ocultas, no para ordenar arbitrariamente todos los recursos.",
    "objective": "Identifica el orden implícito a partir de referencias.",
    "example": "resource \"terraform_data\" \"source\" {\n  input = \"primero\"\n}\nresource \"terraform_data\" \"consumer\" {\n  input = terraform_data.source.output\n}\n",
    "starter": "resource \"terraform_data\" \"source\" {\n  input = \"primero\"\n}\nresource \"terraform_data\" \"consumer\" {\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "terraform_data\\.source\\.output"
    ],
    "missing": "  input = terraform_data.source.output",
    "question": "¿Qué define la dependencia implícita?",
    "options": [
      "Una referencia de valor",
      "El nombre del archivo",
      "El orden de las líneas"
    ],
    "correct": 0,
    "tip": "Conecta `consumer` con `source` por referencia, no por posición.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B08",
    "level": "Básico",
    "title": "Init, fmt y validate",
    "subtitle": "Diferencia preparación, formato y comprobación estática.",
    "concept": "El ciclo recomendado empieza con `terraform fmt -check` y `terraform init -backend=false` para ejercicios seguros, seguido de `terraform validate`. Validate verifica sintaxis y consistencia interna; no demuestra permisos cloud ni un plan real.",
    "objective": "Diferencia preparación, formato y comprobación estática.",
    "example": "terraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"validacion\" {\n  input = \"configuracion preparada\"\n}\n",
    "starter": "terraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"validacion\" {\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "input\\s*=\\s*\"configuracion preparada\""
    ],
    "missing": "  input = \"configuracion preparada\"",
    "question": "¿Qué afirmación es válida?",
    "options": [
      "validate desplegó la red",
      "fmt ejecutó recursos",
      "validate comprueba configuración, no recursos cloud"
    ],
    "correct": 2,
    "tip": "El recurso de práctica debe tener input y permanecer válido como HCL.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B09",
    "level": "Básico",
    "title": "Plan, apply y destroy",
    "subtitle": "Lee operaciones de un plan antes de autorizar cambios.",
    "concept": "Plan muestra cambios propuestos: `+` crear, `~` actualizar, `-` eliminar, `-/+` reemplazar. Apply ejecuta cambios reales; destroy solicita destrucción. En esta academia los planes se muestran como fixtures etiquetados; no hay ejecuciones cloud desde el navegador.",
    "objective": "Lee operaciones de un plan antes de autorizar cambios.",
    "example": "resource \"terraform_data\" \"ciclo\" {\n  input = \"revision necesaria\"\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n",
    "starter": "resource \"terraform_data\" \"ciclo\" {\n  input = \"revision necesaria\"\n  lifecycle {\n# TODO: completa la configuración aquí\n  }\n}\n",
    "required": [
      "prevent_destroy\\s*=\\s*true"
    ],
    "missing": "    prevent_destroy = true",
    "question": "¿Qué indica habitualmente -/+ en un plan?",
    "options": [
      "Reemplazo",
      "Actualización en sitio",
      "Sin cambios"
    ],
    "correct": 0,
    "tip": "Protege este recurso ficticio de un borrado accidental.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B10",
    "level": "Básico",
    "title": "Terraform state y secretos",
    "subtitle": "Comprende qué guarda state y cómo protegerlo.",
    "concept": "El archivo de estado registra objetos y atributos necesarios para la reconciliación. Puede contener datos sensibles. Debe tener acceso mínimo, cifrado, respaldo y nunca publicarse en Git; `sensitive = true` no borra valores del estado.",
    "objective": "Comprende qué guarda state y cómo protegerlo.",
    "example": "variable \"etiqueta\" {\n  type = string\n  sensitive = true\n  default = \"demo-sin-secretos\"\n}\nresource \"terraform_data\" \"state_demo\" {\n  input = var.etiqueta\n}\n",
    "starter": "variable \"etiqueta\" {\n  type = string\n# TODO: completa la configuración aquí\n  default = \"demo-sin-secretos\"\n}\nresource \"terraform_data\" \"state_demo\" {\n  input = var.etiqueta\n}\n",
    "required": [
      "sensitive\\s*=\\s*true"
    ],
    "missing": "  sensitive = true",
    "question": "¿Qué ocurre con un valor sensitive?",
    "options": [
      "No puede aparecer en state",
      "Se oculta en ciertas vistas, pero puede persistir en state",
      "Se cifra automáticamente en todos los destinos"
    ],
    "correct": 1,
    "tip": "Marca el dato de ejemplo como sensible y protege el estado por separado.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B11",
    "level": "Básico",
    "title": "Count, for_each y lifecycle",
    "subtitle": "Elige direcciones estables y evalúa reemplazos.",
    "concept": "Con `count` se indexa por posiciones; con `for_each` por claves. Cambiar la identidad de una clave puede provocar reemplazos, por eso los refactors requieren inspección de plan y, cuando corresponda, bloques `moved`.",
    "objective": "Elige direcciones estables y evalúa reemplazos.",
    "example": "locals {\n  entornos = toset([\"dev\", \"staging\"])\n}\nresource \"terraform_data\" \"entorno\" {\n  for_each = local.entornos\n  input = each.key\n}\n",
    "starter": "locals {\n  entornos = toset([\"dev\", \"staging\"])\n}\nresource \"terraform_data\" \"entorno\" {\n# TODO: completa la configuración aquí\n  input = each.key\n}\n",
    "required": [
      "for_each\\s*=\\s*local\\.entornos",
      "input\\s*=\\s*each\\.key"
    ],
    "missing": "  for_each = local.entornos",
    "question": "¿Qué dirección sería más estable ante reordenar una lista?",
    "options": [
      "count.index",
      "for_each con claves estables",
      "Ninguna dirección"
    ],
    "correct": 1,
    "tip": "La identidad debe estar basada en nombres, no índices cambiantes.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "B12",
    "level": "Básico",
    "title": "Proyecto final básico",
    "subtitle": "Integra recursos, variables, outputs y pruebas locales.",
    "concept": "Un módulo root claro separa entrada, recursos y salida. Para completar el nivel básico diseña una configuración sin proveedor cloud y ejecuta localmente fmt/init/validate/test cuando tengas Terraform CLI instalado.",
    "objective": "Integra recursos, variables, outputs y pruebas locales.",
    "example": "variable \"equipo\" {\n  type = string\n  default = \"vigilio\"\n}\nresource \"terraform_data\" \"proyecto\" {\n  input = var.equipo\n}\noutput \"equipo\" {\n  value = terraform_data.proyecto.output\n}\n",
    "starter": "variable \"equipo\" {\n  type = string\n  default = \"vigilio\"\n}\nresource \"terraform_data\" \"proyecto\" {\n# TODO: completa la configuración aquí\n}\noutput \"equipo\" {\n  value = terraform_data.proyecto.output\n}\n",
    "required": [
      "input\\s*=\\s*var\\.equipo",
      "value\\s*=\\s*terraform_data\\.proyecto\\.output"
    ],
    "missing": "  input = var.equipo",
    "question": "¿Qué es una evidencia válida de test real?",
    "options": [
      "Una captura inventada",
      "Salida de terraform test ejecutada localmente",
      "Que el editor muestre verde"
    ],
    "correct": 1,
    "tip": "Conecta entrada, recurso y salida; luego descarga el pack y prueba localmente.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 100
  },
  {
    "id": "I01",
    "level": "Intermedio",
    "title": "Diseño de módulos",
    "subtitle": "Define contratos y límites claros en módulos reutilizables.",
    "concept": "Los módulos son unidades de reutilización con variables y outputs. Evita que un módulo gestione recursos de otro equipo; mantén interfaces estables, documentación y ejemplos pequeños. Terraform no exige una capa de módulos para cada recurso.",
    "objective": "Define contratos y límites claros en módulos reutilizables.",
    "example": "variable \"nombre\" {\n  type = string\n}\nresource \"terraform_data\" \"modulo\" {\n  input = var.nombre\n}\noutput \"id\" {\n  value = terraform_data.modulo.id\n}\n",
    "starter": "variable \"nombre\" {\n  type = string\n}\nresource \"terraform_data\" \"modulo\" {\n# TODO: completa la configuración aquí\n}\noutput \"id\" {\n  value = terraform_data.modulo.id\n}\n",
    "required": [
      "variable\\s+\"nombre\"",
      "input\\s*=\\s*var\\.nombre"
    ],
    "missing": "  input = var.nombre",
    "question": "¿Cuál es un buen límite de módulo?",
    "options": [
      "Un contrato estable con dueño claro",
      "Toda la nube en un solo módulo",
      "Un módulo por cada atributo"
    ],
    "correct": 0,
    "tip": "Trata variables y outputs como API pública de tu módulo.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I02",
    "level": "Intermedio",
    "title": "Versiones y lockfile",
    "subtitle": "Controla upgrades y reproducibilidad.",
    "concept": "Fija la versión mínima de Terraform y un rango razonable de provider; el lockfile fija una selección y sus checksums. Revisa los cambios de `.terraform.lock.hcl` en PR. Actualiza de forma consciente y prueba planes antes de producción.",
    "objective": "Controla upgrades y reproducibilidad.",
    "example": "terraform {\n  required_version = \">= 1.6.0, < 2.0.0\"\n  required_providers {\n    local = {\n      source = \"hashicorp/local\"\n      version = \"~> 2.5\"\n    }\n  }\n}\n",
    "starter": "terraform {\n  required_version = \">= 1.6.0, < 2.0.0\"\n  required_providers {\n    local = {\n      source = \"hashicorp/local\"\n# TODO: completa la configuración aquí\n    }\n  }\n}\n",
    "required": [
      "local\\s*=\\s*\\{",
      "version\\s*=\\s*\"~>\\s*2\\.5\""
    ],
    "missing": "      version = \"~> 2.5\"",
    "question": "¿Qué aporta .terraform.lock.hcl?",
    "options": [
      "Una instantánea de selección y checksums de providers",
      "Cifrado del estado",
      "Tokens cloud"
    ],
    "correct": 0,
    "tip": "Controla el rango del provider, nunca introduzcas un upgrade libre sin revisar.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I03",
    "level": "Intermedio",
    "title": "Data sources y referencias",
    "subtitle": "Diferencia consultar recursos existentes y gestionarlos.",
    "concept": "Los bloques `data` consultan información de objetos existentes; `resource` declara objetos que Terraform gestiona. La procedencia y la propiedad de cada recurso deben ser explícitas para evitar que dos stacks intenten controlarlo.",
    "objective": "Diferencia consultar recursos existentes y gestionarlos.",
    "example": "resource \"terraform_data\" \"origen\" {\n  input = \"api\"\n}\nresource \"terraform_data\" \"consulta\" {\n  input = terraform_data.origen.output\n}\n",
    "starter": "resource \"terraform_data\" \"origen\" {\n  input = \"api\"\n}\nresource \"terraform_data\" \"consulta\" {\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "input\\s*=\\s*terraform_data\\.origen\\.output"
    ],
    "missing": "  input = terraform_data.origen.output",
    "question": "¿Qué representa un data source?",
    "options": [
      "Recurso siempre creado",
      "Consulta externa de datos",
      "Un estado de backend"
    ],
    "correct": 1,
    "tip": "La práctica usa referencias locales sin proveedores para ilustrar flujos de datos.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I04",
    "level": "Intermedio",
    "title": "Direcciones y moved blocks",
    "subtitle": "Planifica refactors de direcciones sin recrear recursos.",
    "concept": "Un `moved` permite declarar un traslado de dirección de estado sin improvisar `state mv`. Debes revisar el plan resultante y confirmar el tipo e identidad. No implica que toda modificación sea segura.",
    "objective": "Planifica refactors de direcciones sin recrear recursos.",
    "example": "resource \"terraform_data\" \"nuevo\" {\n  input = \"estable\"\n}\nmoved {\n  from = terraform_data.viejo\n  to   = terraform_data.nuevo\n}\n",
    "starter": "resource \"terraform_data\" \"nuevo\" {\n  input = \"estable\"\n}\nmoved {\n  from = terraform_data.viejo\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "moved\\s*\\{",
      "to\\s*=\\s*terraform_data\\.nuevo"
    ],
    "missing": "  to   = terraform_data.nuevo",
    "question": "¿Para qué sirve moved?",
    "options": [
      "Señalar un cambio de dirección administrada",
      "Mover ficheros en disco",
      "Cifrar variables"
    ],
    "correct": 0,
    "tip": "Asegúrate de que from y to sean direcciones de recursos válidas.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I05",
    "level": "Intermedio",
    "title": "Lectura profesional de planes",
    "subtitle": "Identifica acciones destructivas y prioridades de revisión.",
    "concept": "Un plan requiere lectura del diff, sustituciones, atributos marcados sensitive, blast radius y contexto del servicio. Las salidas desconocidas `(known after apply)` no son fallos. No se aprueba por el número de líneas únicamente.",
    "objective": "Identifica acciones destructivas y prioridades de revisión.",
    "example": "resource \"terraform_data\" \"critico\" {\n  input = \"persistencia\"\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n",
    "starter": "resource \"terraform_data\" \"critico\" {\n  input = \"persistencia\"\n  lifecycle {\n# TODO: completa la configuración aquí\n  }\n}\n",
    "required": [
      "prevent_destroy\\s*=\\s*true"
    ],
    "missing": "    prevent_destroy = true",
    "question": "¿Qué cambio merece revisión especial?",
    "options": [
      "No-op",
      "Reemplazo de un componente crítico",
      "Cambio de comentario"
    ],
    "correct": 1,
    "tip": "Usa lifecycle como guarda educativa y evalúa el plan completo.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I06",
    "level": "Intermedio",
    "title": "Remote state y locking",
    "subtitle": "Diseña aislamiento de estado y bloqueo entre escritores.",
    "concept": "Backends remotos permiten colaboración, pero requieren permisos limitados, acceso auditado, cifrado y backups. S3 admite `use_lockfile`; no publiques un backend real con bucket inventado como si estuviera aprovisionado.",
    "objective": "Diseña aislamiento de estado y bloqueo entre escritores.",
    "example": "# Ejemplo ilustrativo: NO inicializar sin infraestructura real\nterraform {\n  backend \"s3\" {\n    bucket = \"REEMPLAZAR-bucket-privado\"\n    key = \"dev/network/terraform.tfstate\"\n    region = \"us-east-1\"\n    use_lockfile = true\n  }\n}\n",
    "starter": "# Ejemplo ilustrativo: NO inicializar sin infraestructura real\nterraform {\n  backend \"s3\" {\n    bucket = \"REEMPLAZAR-bucket-privado\"\n    key = \"dev/network/terraform.tfstate\"\n    region = \"us-east-1\"\n# TODO: completa la configuración aquí\n  }\n}\n",
    "required": [
      "backend\\s+\"s3\"",
      "use_lockfile\\s*=\\s*true"
    ],
    "missing": "    use_lockfile = true",
    "question": "¿Qué evita el bloqueo de estado?",
    "options": [
      "Cualquier drift cloud",
      "Escritores concurrentes sobre el mismo estado",
      "Todo costo cloud"
    ],
    "correct": 1,
    "tip": "El archivo de bloqueo depende de permisos correctos y backend configurado.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I07",
    "level": "Intermedio",
    "title": "Entornos y capas",
    "subtitle": "Separa propietarios y estados según el riesgo.",
    "concept": "Organiza capas por responsabilidad, frecuencia de cambio y blast radius. `development`, `staging` y `production` deben tener protección e identidades apropiadas; evitar un estado gigantesco simplifica recuperación y revisiones.",
    "objective": "Separa propietarios y estados según el riesgo.",
    "example": "variable \"environment\" {\n  type = string\n  validation {\n    condition = contains([\"dev\", \"staging\", \"prod\"], var.environment)\n    error_message = \"Entorno no permitido\"\n  }\n}\n",
    "starter": "variable \"environment\" {\n  type = string\n  validation {\n# TODO: completa la configuración aquí\n    error_message = \"Entorno no permitido\"\n  }\n}\n",
    "required": [
      "contains\\(\\[\"dev\",\\s*\"staging\",\\s*\"prod\"\\],\\s*var\\.environment\\)"
    ],
    "missing": "    condition = contains([\"dev\", \"staging\", \"prod\"], var.environment)",
    "question": "¿Por qué separar estados?",
    "options": [
      "Para ampliar el blast radius",
      "Para aislar ownership y riesgo",
      "Para ignorar CI"
    ],
    "correct": 1,
    "tip": "Declara qué entornos son aceptados en la variable.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I08",
    "level": "Intermedio",
    "title": "Outputs entre módulos",
    "subtitle": "Diseña contratos entre stacks sin acoplamiento invisible.",
    "concept": "Los outputs exponen identificadores necesarios para otros módulos. Prefiere interfaces con propiedad explícita y valores mínimos; no conviertas los outputs en un volcadero de secretos. Documenta cambios incompatibles.",
    "objective": "Diseña contratos entre stacks sin acoplamiento invisible.",
    "example": "resource \"terraform_data\" \"red\" {\n  input = \"vpc-demo\"\n}\noutput \"network_id\" {\n  value = terraform_data.red.id\n  description = \"Identificador de ejemplo de red\"\n}\n",
    "starter": "resource \"terraform_data\" \"red\" {\n  input = \"vpc-demo\"\n}\noutput \"network_id\" {\n# TODO: completa la configuración aquí\n  description = \"Identificador de ejemplo de red\"\n}\n",
    "required": [
      "output\\s+\"network_id\"",
      "value\\s*=\\s*terraform_data\\.red\\.id"
    ],
    "missing": "  value = terraform_data.red.id",
    "question": "¿Qué debe exponer un output de módulo?",
    "options": [
      "Todos los secretos",
      "Solo el contrato necesario",
      "Estado completo"
    ],
    "correct": 1,
    "tip": "Publica solo datos que el consumidor necesita.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I09",
    "level": "Intermedio",
    "title": "Terraform test y mocks",
    "subtitle": "Separa unit tests, mocks y pruebas de integración.",
    "concept": "Los tests `.tftest.hcl` pueden ejecutar `plan` y `apply`; con mocks evitan contactos reales para providers soportados. Un mock verde demuestra lógica declarada, no permisos ni comportamiento de API. Usa runners y sandboxes limitados.",
    "objective": "Separa unit tests, mocks y pruebas de integración.",
    "example": "resource \"terraform_data\" \"test_demo\" {\n  input = \"seguro\"\n}\noutput \"valor\" {\n  value = terraform_data.test_demo.output\n}\n",
    "starter": "resource \"terraform_data\" \"test_demo\" {\n# TODO: completa la configuración aquí\n}\noutput \"valor\" {\n  value = terraform_data.test_demo.output\n}\n",
    "required": [
      "input\\s*=\\s*\"seguro\""
    ],
    "missing": "  input = \"seguro\"",
    "question": "¿Qué demuestra un mock_provider PASS?",
    "options": [
      "Integración real con la nube",
      "Solo el comportamiento cubierto por el mock",
      "Un despliegue listo para producción"
    ],
    "correct": 1,
    "tip": "Descarga el lab local para ver un archivo .tftest.hcl.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I10",
    "level": "Intermedio",
    "title": "Lint, scanning y policy",
    "subtitle": "Distingue reglas de estilo y controles de seguridad.",
    "concept": "Fmt revisa estilo, validate estructura, linters patrones y policy evalúa contratos. Una advertencia nunca se resuelve suprimiéndola indiscriminadamente; presenta owner, severidad, evidencia y excepción acotada cuando aplique.",
    "objective": "Distingue reglas de estilo y controles de seguridad.",
    "example": "variable \"owner\" {\n  type = string\n  validation {\n    condition = length(trimspace(var.owner)) > 0\n    error_message = \"Owner obligatorio\"\n  }\n}\n",
    "starter": "variable \"owner\" {\n  type = string\n  validation {\n# TODO: completa la configuración aquí\n    error_message = \"Owner obligatorio\"\n  }\n}\n",
    "required": [
      "length\\(trimspace\\(var\\.owner\\)\\)\\s*>\\s*0"
    ],
    "missing": "    condition = length(trimspace(var.owner)) > 0",
    "question": "¿Qué hacer ante un hallazgo HIGH?",
    "options": [
      "Ignorarlo globalmente",
      "Evaluar, corregir o gestionar excepción acotada",
      "Ocultar el reporte"
    ],
    "correct": 1,
    "tip": "Declara un control positivo sobre el owner del recurso.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I11",
    "level": "Intermedio",
    "title": "Pipeline de pull requests",
    "subtitle": "Define gates y separación de planificación y despliegue.",
    "concept": "Una PR debe ejecutar fmt, validate, tests seguros y revisión de planes con permisos mínimos. El apply real requiere contexto autorizado, aprobado y revisión del plan final. Los binarios de plan pueden contener secretos.",
    "objective": "Define gates y separación de planificación y despliegue.",
    "example": "variable \"approved\" {\n  type = bool\n  default = false\n}\nresource \"terraform_data\" \"release\" {\n  input = var.approved ? \"autorizado\" : \"bloqueado\"\n}\n",
    "starter": "variable \"approved\" {\n  type = bool\n# TODO: completa la configuración aquí\n}\nresource \"terraform_data\" \"release\" {\n  input = var.approved ? \"autorizado\" : \"bloqueado\"\n}\n",
    "required": [
      "variable\\s+\"approved\"",
      "default\\s*=\\s*false"
    ],
    "missing": "  default = false",
    "question": "¿Cuál es una práctica segura?",
    "options": [
      "Aplicar desde cualquier PR",
      "Aprobar un plan y aplicar otro silenciosamente",
      "Aplicar un plan final autorizado en entorno protegido"
    ],
    "correct": 2,
    "tip": "Un switch de aprobación no reemplaza un gate de CI real; aprende a distinguirlos.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "I12",
    "level": "Intermedio",
    "title": "Proyecto de módulo reusable",
    "subtitle": "Empaqueta un contrato comprobable sin cloud.",
    "concept": "Combina variables tipadas, documentación, outputs y tests de plan. La práctica local usa `terraform_data` para demostrar composición. En producción necesitarías validar los providers reales y las pruebas de integración.",
    "objective": "Empaqueta un contrato comprobable sin cloud.",
    "example": "variable \"service\" {\n  type = string\n  default = \"web\"\n}\nresource \"terraform_data\" \"service\" {\n  input = \"service-${var.service}\"\n}\noutput \"service_name\" {\n  value = terraform_data.service.output\n}\n",
    "starter": "variable \"service\" {\n  type = string\n  default = \"web\"\n}\nresource \"terraform_data\" \"service\" {\n# TODO: completa la configuración aquí\n}\noutput \"service_name\" {\n  value = terraform_data.service.output\n}\n",
    "required": [
      "input\\s*=\\s*\"service-\\$\\{var\\.service\\}\""
    ],
    "missing": "  input = \"service-${var.service}\"",
    "question": "¿Qué vuelve reutilizable un módulo?",
    "options": [
      "Interfaces documentadas y tests",
      "Un único entorno hardcoded",
      "Claves de acceso embebidas"
    ],
    "correct": 0,
    "tip": "Guarda el módulo con su test local y revisa la interfaz pública.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 140
  },
  {
    "id": "A01",
    "level": "Avanzado",
    "title": "Importación y refactors",
    "subtitle": "Planifica importar sin destruir infraestructura existente.",
    "concept": "Los bloques `import` expresan la intención de asociar un objeto existente con una dirección de estado. Primero confirma ownership, permisos, identidad y plan de recuperación; un import no corrige automáticamente la configuración.",
    "objective": "Planifica importar sin destruir infraestructura existente.",
    "example": "# Ejemplo ilustrativo: requiere un recurso existente real\nimport {\n  to = aws_s3_bucket.existente\n  id = \"bucket-real-existente\"\n}\nresource \"aws_s3_bucket\" \"existente\" {\n  bucket = \"bucket-real-existente\"\n}\n",
    "starter": "# Ejemplo ilustrativo: requiere un recurso existente real\nimport {\n# TODO: completa la configuración aquí\n  id = \"bucket-real-existente\"\n}\nresource \"aws_s3_bucket\" \"existente\" {\n  bucket = \"bucket-real-existente\"\n}\n",
    "required": [
      "import\\s*\\{",
      "to\\s*=\\s*aws_s3_bucket\\.existente"
    ],
    "missing": "  to = aws_s3_bucket.existente",
    "question": "¿Qué ocurre antes de importar un recurso?",
    "options": [
      "Validar identidad y propiedad",
      "Borrar el estado",
      "Aplicar sin revisión"
    ],
    "correct": 0,
    "tip": "La sintaxis se estudia con un ejemplo: no se ejecuta en la web.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A02",
    "level": "Avanzado",
    "title": "Migración de backends",
    "subtitle": "Prepara backup, ventana de cambio y rollback.",
    "concept": "Una migración de estado es una operación de alto riesgo. Congela escritores, verifica backups y acceso de destino, ejecuta el proceso de migración desde un contexto autorizado y vuelve a comprobar inventario y recursos.",
    "objective": "Prepara backup, ventana de cambio y rollback.",
    "example": "# Ejemplo ilustrativo de backend nuevo\nterraform {\n  backend \"s3\" {\n    bucket = \"REEMPLAZAR-estado-versionado\"\n    key = \"prod/app/terraform.tfstate\"\n    region = \"us-east-1\"\n    use_lockfile = true\n  }\n}\n",
    "starter": "# Ejemplo ilustrativo de backend nuevo\nterraform {\n  backend \"s3\" {\n    bucket = \"REEMPLAZAR-estado-versionado\"\n# TODO: completa la configuración aquí\n    region = \"us-east-1\"\n    use_lockfile = true\n  }\n}\n",
    "required": [
      "key\\s*=\\s*\"prod/app/terraform\\.tfstate\""
    ],
    "missing": "    key = \"prod/app/terraform.tfstate\"",
    "question": "¿Qué debe ocurrir ANTES de migrate-state?",
    "options": [
      "Backup y freeze de escritores",
      "Force-unlock por costumbre",
      "Eliminar el backend anterior"
    ],
    "correct": 0,
    "tip": "Pon una clave de estado aislada para producción.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A03",
    "level": "Avanzado",
    "title": "Secretos y valores ephemeral",
    "subtitle": "Evalúa exposición en estado, planes y logs.",
    "concept": "`sensitive` puede ocultar ciertos valores de salidas, pero no equivale a sacarlos del estado. Las variables y outputs `ephemeral`, cuando el soporte y contexto aplican, evitan persistir ciertos valores; hay restricciones de uso. Nunca publiques secretos reales.",
    "objective": "Evalúa exposición en estado, planes y logs.",
    "example": "variable \"token_temporal\" {\n  type = string\n  sensitive = true\n  ephemeral = true\n}\n",
    "starter": "variable \"token_temporal\" {\n  type = string\n  sensitive = true\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "sensitive\\s*=\\s*true",
      "ephemeral\\s*=\\s*true"
    ],
    "missing": "  ephemeral = true",
    "question": "¿Qué garantiza sensitive=true por sí solo?",
    "options": [
      "Excluir del state",
      "Ocultar ciertas presentaciones, no excluir state",
      "Rotar automáticamente el token"
    ],
    "correct": 1,
    "tip": "Contrasta sensibilidad visual y persistencia con el atributo ephemeral.",
    "warning": "Las variables ephemeral requieren una versión compatible de Terraform; verifica la versión de CLI antes de ejecutar.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A04",
    "level": "Avanzado",
    "title": "IAM mínimo y OIDC",
    "subtitle": "Modela federación y permisos de despliegue por entorno.",
    "concept": "OIDC permite credenciales temporales mediante identidad de workload; una política de confianza acota repositorio, rama y ambiente. Los secretos estáticos y permisos `*` amplios son riesgos. Esta lección no establece roles AWS reales.",
    "objective": "Modela federación y permisos de despliegue por entorno.",
    "example": "variable \"entorno_autorizado\" {\n  type = string\n  validation {\n    condition = contains([\"staging\", \"prod\"], var.entorno_autorizado)\n    error_message = \"Entorno no autorizado\"\n  }\n}\n",
    "starter": "variable \"entorno_autorizado\" {\n  type = string\n  validation {\n# TODO: completa la configuración aquí\n    error_message = \"Entorno no autorizado\"\n  }\n}\n",
    "required": [
      "contains\\(\\[\"staging\",\\s*\"prod\"\\],\\s*var\\.entorno_autorizado\\)"
    ],
    "missing": "    condition = contains([\"staging\", \"prod\"], var.entorno_autorizado)",
    "question": "¿Qué reduce riesgo de CI cloud?",
    "options": [
      "Credenciales estáticas compartidas",
      "OIDC con trust limitado y entorno protegido",
      "Permisos administrador por defecto"
    ],
    "correct": 1,
    "tip": "Especifica qué entornos puede elegir el pipeline.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A05",
    "level": "Avanzado",
    "title": "Redes y rangos CIDR",
    "subtitle": "Razona sobre redes sin solapamientos.",
    "concept": "Los bloques CIDR describen rangos de direcciones; dos redes conectadas con bloques solapados generan conflictos. El ejercicio muestra una función `cidrsubnet` sobre ejemplos ficticios; no se crean VPC reales.",
    "objective": "Razona sobre redes sin solapamientos.",
    "example": "variable \"red\" {\n  type = string\n  default = \"10.42.0.0/16\"\n}\nlocals {\n  subred_publica = cidrsubnet(var.red, 8, 0)\n  subred_privada = cidrsubnet(var.red, 8, 1)\n}\n",
    "starter": "variable \"red\" {\n  type = string\n  default = \"10.42.0.0/16\"\n}\nlocals {\n  subred_publica = cidrsubnet(var.red, 8, 0)\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "cidrsubnet\\(var\\.red,\\s*8,\\s*1\\)"
    ],
    "missing": "  subred_privada = cidrsubnet(var.red, 8, 1)",
    "question": "¿Cuál es un riesgo de CIDR superpuesto?",
    "options": [
      "Enrutamiento ambiguo",
      "Menor costo de logs",
      "Bloqueo de state automático"
    ],
    "correct": 0,
    "tip": "Utiliza un número de subred diferente para la privada.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A06",
    "level": "Avanzado",
    "title": "Drift y reconciliación",
    "subtitle": "Diferencia Git, estado y realidad de infraestructura.",
    "concept": "Drift sucede cuando la infraestructura cambia fuera de la configuración y Terraform detecta diferencias. No siempre se soluciona aplicando automáticamente: investiga la intención del cambio, la seguridad y el estado real antes de reconciliar.",
    "objective": "Diferencia Git, estado y realidad de infraestructura.",
    "example": "resource \"terraform_data\" \"baseline\" {\n  input = \"controlado-en-git\"\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n",
    "starter": "resource \"terraform_data\" \"baseline\" {\n  input = \"controlado-en-git\"\n  lifecycle {\n# TODO: completa la configuración aquí\n  }\n}\n",
    "required": [
      "prevent_destroy\\s*=\\s*true"
    ],
    "missing": "    prevent_destroy = true",
    "question": "¿Cuál es el primer paso ante drift crítico?",
    "options": [
      "Aplicar sin revisar",
      "Identificar la causa y evaluar impacto",
      "Borrar recursos"
    ],
    "correct": 1,
    "tip": "Protege el baseline de ejemplo y prepara un plan de reconciliación.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A07",
    "level": "Avanzado",
    "title": "Reemplazo y disponibilidad",
    "subtitle": "Evalúa lifecycle, provider y costos temporales.",
    "concept": "Un reemplazo puede causar pérdida de disponibilidad, doble consumo o incompatibilidad de nombres únicos. `create_before_destroy` es útil en ciertos recursos pero no garantiza éxito: comprueba restricciones y capacidad, no actives a ciegas.",
    "objective": "Evalúa lifecycle, provider y costos temporales.",
    "example": "resource \"terraform_data\" \"web\" {\n  input = \"v2\"\n  lifecycle {\n    create_before_destroy = true\n  }\n}\n",
    "starter": "resource \"terraform_data\" \"web\" {\n  input = \"v2\"\n  lifecycle {\n# TODO: completa la configuración aquí\n  }\n}\n",
    "required": [
      "create_before_destroy\\s*=\\s*true"
    ],
    "missing": "    create_before_destroy = true",
    "question": "¿Qué debes verificar antes de create_before_destroy?",
    "options": [
      "Nada: siempre funciona",
      "Cuotas, nombres únicos y dependencias",
      "Solo el color del dashboard"
    ],
    "correct": 1,
    "tip": "Declara la intención y explica sus límites en la decisión.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A08",
    "level": "Avanzado",
    "title": "Policy as Code",
    "subtitle": "Escribe controles y excepciones auditables.",
    "concept": "Una política aplicada a IaC debe tener tests positivos y negativos; las excepciones necesitan owner, motivo y caducidad. La función de condición ejemplifica validación local, no la ejecución de OPA/Conftest.",
    "objective": "Escribe controles y excepciones auditables.",
    "example": "variable \"cost_center\" {\n  type = string\n  validation {\n    condition = length(trimspace(var.cost_center)) >= 3\n    error_message = \"CostCenter requerido\"\n  }\n}\n",
    "starter": "variable \"cost_center\" {\n  type = string\n  validation {\n# TODO: completa la configuración aquí\n    error_message = \"CostCenter requerido\"\n  }\n}\n",
    "required": [
      "length\\(trimspace\\(var\\.cost_center\\)\\)\\s*>=\\s*3"
    ],
    "missing": "    condition = length(trimspace(var.cost_center)) >= 3",
    "question": "¿Qué evidencia acompaña una excepción?",
    "options": [
      "Owner y expiración",
      "Un emoji",
      "Ninguna evidencia"
    ],
    "correct": 0,
    "tip": "Elabora un control simple y revisable sobre CostCenter.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A09",
    "level": "Avanzado",
    "title": "FinOps para Terraform",
    "subtitle": "Evalúa incrementos de costo y trade-offs de disponibilidad.",
    "concept": "Infracost estima diferencias; no es la factura definitiva. Un cambio de tamaño, región o cantidad puede disparar costos. Aplica presupuestos, tags, evaluación de fiabilidad y seguimiento después del despliegue.",
    "objective": "Evalúa incrementos de costo y trade-offs de disponibilidad.",
    "example": "variable \"replicas\" {\n  type = number\n  default = 2\n  validation {\n    condition = var.replicas >= 1 && var.replicas <= 5\n    error_message = \"Replicas fuera de presupuesto\"\n  }\n}\n",
    "starter": "variable \"replicas\" {\n  type = number\n  default = 2\n  validation {\n# TODO: completa la configuración aquí\n    error_message = \"Replicas fuera de presupuesto\"\n  }\n}\n",
    "required": [
      "var\\.replicas\\s*>=\\s*1\\s*&&\\s*var\\.replicas\\s*<=\\s*5"
    ],
    "missing": "    condition = var.replicas >= 1 && var.replicas <= 5",
    "question": "¿Qué representa un costo Infracost?",
    "options": [
      "Una estimación para revisión",
      "El total garantizado de factura",
      "Un test de seguridad"
    ],
    "correct": 0,
    "tip": "Controla límites y el número permitido de réplicas.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A10",
    "level": "Avanzado",
    "title": "AWS multiambiente",
    "subtitle": "Diseña cuentas, estados y acceso separados para dev/staging/prod.",
    "concept": "Un diseño serio evita compartir la misma identidad para todos los entornos. Separa cuentas o boundaries adecuados, states versionados y reglas de aprobación. El ejemplo es un contrato local; no aprovisiona cuentas AWS.",
    "objective": "Diseña cuentas, estados y acceso separados para dev/staging/prod.",
    "example": "variable \"entorno\" {\n  type = string\n  validation {\n    condition = contains([\"dev\", \"staging\", \"prod\"], var.entorno)\n    error_message = \"Entorno desconocido\"\n  }\n}\nlocals {\n  namespace = \"app-${var.entorno}\"\n}\n",
    "starter": "variable \"entorno\" {\n  type = string\n  validation {\n    condition = contains([\"dev\", \"staging\", \"prod\"], var.entorno)\n    error_message = \"Entorno desconocido\"\n  }\n}\nlocals {\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "namespace\\s*=\\s*\"app-\\$\\{var\\.entorno\\}\""
    ],
    "missing": "  namespace = \"app-${var.entorno}\"",
    "question": "¿Cómo protegerías producción?",
    "options": [
      "Mismo state y permisos que dev",
      "State e identidad aislados y aprobación",
      "Llaves en README"
    ],
    "correct": 1,
    "tip": "Deriva nombres consistentes sin mezclar propiedad de entornos.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A11",
    "level": "Avanzado",
    "title": "Terraform, Helm y GitOps",
    "subtitle": "Establece límites de ownership con Kubernetes.",
    "concept": "Terraform puede administrar la infraestructura del cluster y algunos servicios base; Helm/Argo CD suelen administrar despliegues de workloads. Dos controladores propietarios del mismo recurso pueden producir guerras de reconciliación.",
    "objective": "Establece límites de ownership con Kubernetes.",
    "example": "variable \"owner\" {\n  type = string\n  default = \"gitops\"\n}\nresource \"terraform_data\" \"handoff\" {\n  input = \"workloads-managed-by-${var.owner}\"\n}\n",
    "starter": "variable \"owner\" {\n  type = string\n  default = \"gitops\"\n}\nresource \"terraform_data\" \"handoff\" {\n# TODO: completa la configuración aquí\n}\n",
    "required": [
      "workloads-managed-by-\\$\\{var\\.owner\\}"
    ],
    "missing": "  input = \"workloads-managed-by-${var.owner}\"",
    "question": "¿Qué evita drift entre Terraform y GitOps?",
    "options": [
      "Doble ownership",
      "Contrato de ownership explícito",
      "Apply continuo de ambos"
    ],
    "correct": 1,
    "tip": "Declara el handoff sin intentar gestionar los mismos workloads dos veces.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  },
  {
    "id": "A12",
    "level": "Avanzado",
    "title": "Proyecto avanzado",
    "subtitle": "Diseña un servicio auditable con seguridad, costo y plan de recuperación.",
    "concept": "La entrega senior exige más que sintaxis: separación de estados, pruebas, control de identidades, revisión de plan, FinOps y rollback. Construye un artefacto pequeño, explícito y reproducible antes de saltar a un cloud real.",
    "objective": "Diseña un servicio auditable con seguridad, costo y plan de recuperación.",
    "example": "variable \"environment\" {\n  type = string\n  default = \"staging\"\n}\nresource \"terraform_data\" \"deployment\" {\n  input = \"${var.environment}-reviewed\"\n  lifecycle {\n    prevent_destroy = true\n  }\n}\noutput \"id\" {\n  value = terraform_data.deployment.id\n}\n",
    "starter": "variable \"environment\" {\n  type = string\n  default = \"staging\"\n}\nresource \"terraform_data\" \"deployment\" {\n  input = \"${var.environment}-reviewed\"\n  lifecycle {\n# TODO: completa la configuración aquí\n  }\n}\noutput \"id\" {\n  value = terraform_data.deployment.id\n}\n",
    "required": [
      "prevent_destroy\\s*=\\s*true",
      "output\\s+\"id\""
    ],
    "missing": "    prevent_destroy = true",
    "question": "¿Qué impide declarar este proyecto production ready?",
    "options": [
      "Falta de una captura",
      "No haber probado providers ni plan cloud real",
      "Usar TypeScript en UI"
    ],
    "correct": 1,
    "tip": "Agrega guardas y prepara evidencias concretas de tests locales.",
    "warning": "La comprobación web es educativa: no sustituye terraform validate, terraform plan o pruebas cloud.",
    "category": "IaC",
    "xp": 180
  }
] as Lesson[];
export const tracks: Track[] = [
  {
    "title": "Fundamentos",
    "from": "B01",
    "to": "B12",
    "description": "Aprender HCL y el ciclo de Terraform",
    "icon": "book-open"
  },
  {
    "title": "Módulos",
    "from": "I01",
    "to": "I12",
    "description": "Componentes reutilizables y contratos",
    "icon": "boxes"
  },
  {
    "title": "Cloud seguro",
    "from": "A01",
    "to": "A12",
    "description": "Identidad, permisos y secretos",
    "icon": "shield"
  },
  {
    "title": "DevSecOps",
    "from": "I09",
    "to": "A12",
    "description": "Gates de CI, policy y auditoría",
    "icon": "git-branch"
  },
  {
    "title": "State & DR",
    "from": "B10",
    "to": "A06",
    "description": "Bloqueos, drift y recuperación",
    "icon": "database"
  },
  {
    "title": "FinOps",
    "from": "A09",
    "to": "A12",
    "description": "Presupuesto y eficiencia cloud",
    "icon": "trending-down"
  },
  {
    "title": "Kubernetes",
    "from": "A10",
    "to": "A11",
    "description": "Ownership de infraestructura y GitOps",
    "icon": "network"
  },
  {
    "title": "Platform Senior",
    "from": "S01",
    "to": "S18",
    "description": "Incidentes, ADR y capstone",
    "icon": "crown"
  }
] as Track[];
export const getLesson = (id: string): Lesson | undefined => lessons.find(lesson => lesson.id === id);
