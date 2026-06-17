# 5. Cómo funciona este proyecto

[← Roles](04-roles-coordinador-participante.md) · [Índice](README.md) · [Siguiente: Guía de inicio →](06-guia-de-inicio.md)

## Qué tecnologías usa

| Pieza | Para qué sirve en este proyecto |
|-------|--------------------------------|
| **NestJS** | Framework que organiza el código del servidor (controladores, servicios) |
| **PostgreSQL** | Base de datos donde cada participante guarda el log de transacciones |
| **TypeORM** | Librería que escribe y lee en PostgreSQL desde TypeScript |
| **Docker Compose** | Levanta PostgreSQL con un solo comando, sin instalarlo a mano |
| **Axios (HttpModule)** | El coordinador usa esto para llamar a los participantes por HTTP |

## Estructura del código

```
src/
├── coordinator/
│   ├── coordinator.controller.ts   → Recibe POST /coordinator/execute
│   └── coordinator.service.ts      → Ejecuta las 2 fases del protocolo
├── transaction/
│   ├── transaction.controller.ts   → Endpoints prepare, commit, abort
│   └── transaction.service.ts      → Lógica del participante + base de datos
├── log/
│   └── transaction-log.entity.ts   → Tabla transaction_logs en PostgreSQL
└── app.module.ts                   → Conecta todo y lee variables del .env
```

## Recorrido de una transacción exitosa

Supón que envías `transactionId: "tx-001"` al coordinador.

### Paso 1 — Tú llamas al coordinador

```http
POST http://localhost:3000/coordinator/execute
{ "transactionId": "tx-001" }
```

El `CoordinatorController` delega en `CoordinatorService.executeGlobalTransaction()`.

### Paso 2 — Fase 1 en el coordinador

El servicio recorre la lista `PARTICIPANTS` y a cada URL le hace:

```http
POST http://localhost:3001/transaction/prepare
{ "transactionId": "tx-001" }
```

En el participante, `TransactionService.prepare()`:

1. Crea un registro en la tabla `transaction_logs` con `state: PREPARED`.
2. Responde `{ "status": "VOTE_COMMIT" }`.

Si la base de datos falla, responde `VOTE_ABORT`.

### Paso 3 — Decisión del coordinador

Si **todos** respondieron `VOTE_COMMIT`, el coordinador elige la fase 2 como `commit`. Si no, elige `abort`.

### Paso 4 — Fase 2 en el coordinador

Envía a cada participante:

```http
POST http://localhost:3001/transaction/commit
{ "transactionId": "tx-001" }
```

El participante actualiza el registro a `state: COMMITTED` y responde `{ "status": "ACK" }`.

### Paso 5 — Respuesta final

```json
{
  "transactionId": "tx-001",
  "status": "GLOBAL_COMMIT_SUCCESS"
}
```

Si hubo algún voto en contra o error de red en la fase 1, el status sería `GLOBAL_ROLLBACK_EXECUTED` y se habría llamado a `/transaction/abort` en lugar de `/transaction/commit`.

## Tabla en la base de datos

Cada participante guarda filas en `transaction_logs`:

| transactionId | state | Significado |
|---------------|-------|-------------|
| tx-001 | PREPARED | Fase 1 completada, esperando decisión |
| tx-001 | COMMITTED | Transacción confirmada |
| tx-001 | ABORTED | Transacción cancelada |

Puedes consultar la tabla con cualquier cliente de PostgreSQL para ver cómo cambia el estado.

## Variables de entorno que lee el código

| Variable | Quién la usa | Descripción |
|----------|--------------|-------------|
| `PORT` | Todos | Puerto HTTP de esta instancia |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Participantes (y coordinador si comparte DB) | Conexión a PostgreSQL |
| `PARTICIPANTS` | Solo coordinador | URLs de los participantes, separadas por coma |

El coordinador **no escribe** en la base de datos para el protocolo 2PC; solo orquesta las llamadas HTTP. Los participantes **sí** persisten el estado.

## Qué ver en los logs

Al ejecutar `npm run start:dev`, verás mensajes como:

```
[CoordinatorService] [2PC INICIO] Transacción global: tx-001
[TransactionService] Recibido PREPARE para la tx: tx-001
[CoordinatorService] [2PC DECISIÓN] Ejecutando GLOBAL COMMIT.
[TransactionService] Recibido GLOBAL_COMMIT para la tx: tx-001
```

Son útiles para seguir el flujo fase por fase sin leer todo el código.

## Qué NO hace este proyecto (a propósito)

- No implementa lógica de negocio real (transferencias, inventario, etc.): solo demuestra el protocolo.
- No recupera automáticamente si el coordinador se apaga a mitad del proceso.
- No valida autenticación ni permisos en las peticiones HTTP.

Es una **maqueta educativa** del protocolo, no un motor de transacciones listo para producción.

---

[Siguiente: Guía de inicio paso a paso →](06-guia-de-inicio.md)
