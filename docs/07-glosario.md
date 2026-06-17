# 7. Glosario

[← Guía de inicio](06-guia-de-inicio.md) · [Índice](README.md)

Definiciones breves de los términos que aparecen en la documentación y en el código.

| Término | Significado sencillo |
|---------|---------------------|
| **2PC** | Two-Phase Commit. Protocolo en dos fases para confirmar o cancelar una transacción en varios nodos. |
| **Abort** | Cancelar / deshacer una transacción. |
| **ACK** | Acknowledge. Confirmación de que el participante recibió la orden (en este proyecto: `{ "status": "ACK" }`). |
| **Commit** | Confirmar definitivamente una transacción. |
| **Coordinador** | Nodo que inicia el 2PC, recoge votos y envía la decisión final. |
| **Nodo** | Una instancia del programa corriendo en un puerto (por ejemplo, el coordinador en el 3000). |
| **Participante** | Nodo que vota en la fase 1 y aplica commit o abort en la fase 2. |
| **Prepare** | Fase 1 del 2PC. El participante se prepara y emite su voto. |
| **Rollback** | Sinónimo de abort en este contexto: revertir o marcar como cancelado. |
| **Sistema distribuido** | Varios programas o bases de datos en distintas máquinas que deben trabajar de forma coordinada. |
| **Transacción** | Operación que debe completarse entera o no ejecutarse (todo o nada). |
| **Transacción distribuida** | Transacción que afecta a más de una base de datos o servicio. |
| **TransactionId** | Identificador único de una transacción global (por ejemplo `tx-001`). |
| **VOTE_COMMIT** | Voto del participante: "estoy listo para confirmar". |
| **VOTE_ABORT** | Voto del participante: "no puedo confirmar". |
| **REST / HTTP** | Forma estándar de que programas se envíen mensajes por la red (como las páginas web). |
| **PostgreSQL** | Sistema de base de datos donde se guardan los logs de cada participante. |
| **TypeORM** | Herramienta que conecta el código TypeScript con PostgreSQL. |
| **Docker Compose** | Archivo que describe cómo levantar servicios (aquí, PostgreSQL) en contenedores. |
| **`.env`** | Archivo con configuración local (puertos, contraseñas de base de datos, etc.). No se sube a git por seguridad. |

---

[← Volver al índice](README.md)
