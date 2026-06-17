# 6. Guía de inicio paso a paso

[← Cómo funciona el proyecto](05-como-funciona-el-proyecto.md) · [Índice](README.md) · [Siguiente: Glosario →](07-glosario.md)

Esta guía asume que acabas de descargar el proyecto y quieres ver el protocolo 2PC funcionando en tu máquina.

## Requisitos previos

Instala en tu ordenador:

- [Node.js](https://nodejs.org/) 18 o superior
- [Docker](https://www.docker.com/) (para la base de datos)
- Una terminal (bash, zsh, etc.)
- Opcional: [curl](https://curl.se/) o [Postman](https://www.postman.com/) para enviar peticiones HTTP

## Paso 1 — Descargar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd twophase-commit
npm install
```

## Paso 2 — Levantar la base de datos

El archivo `docker-compose.yml` incluye PostgreSQL para el **primer participante**:

```bash
docker compose up -d
```

Comprueba que está corriendo:

```bash
docker compose ps
```

## Paso 3 — Configurar cada nodo con su archivo `.env`

En la raíz del proyecto hay dos plantillas:

| Plantilla | Rol |
|-----------|-----|
| `.env.coordinator.example` | Nodo coordinador (puerto 3000) |
| `.env.participant.example` | Nodo participante (puerto 3001) |

### Opción A — Un solo participante (más simple)

**Terminal del participante:**

```bash
cp .env.participant.example .env
npm run start:dev
```

**Terminal del coordinador** (en otra ventana, misma carpeta del proyecto):

```bash
cp .env.coordinator.example .env
# Edita PARTICIPANTS si solo tienes un participante:
# PARTICIPANTS=http://localhost:3001
npm run start:dev
```

> **Nota:** Si copias `.env` en la misma carpeta para dos terminales, el segundo `cp` sobrescribe el primero. Para dos participantes a la vez, usa la **Opción B**.

### Opción B — Dos participantes y un coordinador (demo completa)

Necesitas **dos bases de datos**. El `docker-compose.yml` trae una en el puerto 5432. Para la segunda, puedes levantar otro contenedor:

```bash
docker run -d --name postgres-participant-2 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=participant_db_2 \
  -p 5433:5432 \
  postgres:15
```

**Terminal 1 — Participante 1:**

```bash
cp .env.participant.example .env
npm run start:dev
```

**Terminal 2 — Participante 2:**

Crea un `.env` manualmente (o copia la plantilla y cambia los valores):

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASSWORD=password
DB_NAME=participant_db_2
```

```bash
npm run start:dev
```

**Terminal 3 — Coordinador:**

```bash
cp .env.coordinator.example .env
npm run start:dev
```

El coordinador ya viene configurado con:

```env
PARTICIPANTS=http://localhost:3001,http://localhost:3002
```

### Opción C — Pasar variables sin copiar `.env`

Útil si no quieres sobrescribir el archivo en cada terminal:

```bash
# Participante
env $(grep -v '^#' .env.participant.example | xargs) npm run start:dev

# Coordinador
env $(grep -v '^#' .env.coordinator.example | xargs) npm run start:dev
```

## Paso 4 — Ejecutar una transacción

Con el coordinador y al menos un participante en marcha:

```bash
curl -X POST http://localhost:3000/coordinator/execute \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "tx-001"}'
```

**Respuesta si todo va bien:**

```json
{
  "transactionId": "tx-001",
  "status": "GLOBAL_COMMIT_SUCCESS"
}
```

**Respuesta si algún participante falla o vota en contra:**

```json
{
  "transactionId": "tx-001",
  "status": "GLOBAL_ROLLBACK_EXECUTED"
}
```

## Paso 5 — Comprobar la base de datos

Conecta a PostgreSQL del participante 1:

```bash
docker exec -it twophase-commit-db-participant-1 psql -U admin -d participant_db
```

> El nombre del contenedor puede variar. Lista los contenedores con `docker ps` y usa el nombre correcto.

Dentro de `psql`:

```sql
SELECT "transactionId", state, "createdAt" FROM transaction_logs;
```

Deberías ver `tx-001` con estado `COMMITTED` o `ABORTED`.

## Solución de problemas frecuentes

| Problema | Posible causa | Qué hacer |
|----------|---------------|-----------|
| `ECONNREFUSED` al coordinar | Participante no está levantado | Arranca el participante antes y revisa `PARTICIPANTS` |
| Error de conexión a PostgreSQL | Docker no está corriendo | `docker compose up -d` |
| Puerto en uso | Otra app usa 3000, 3001, etc. | Cambia `PORT` en el `.env` correspondiente |
| Coordinador no encuentra participantes | URL incorrecta en `PARTICIPANTS` | Debe ser `http://localhost:PUERTO` sin barra final |

## Siguiente lectura

- [Glosario](07-glosario.md) — términos rápidos
- [README principal](../README.md) — referencia técnica resumida

---

[Siguiente: Glosario →](07-glosario.md)
