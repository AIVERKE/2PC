# 4. Coordinador y participante

[← Protocolo 2PC](03-protocolo-dos-fases.md) · [Índice](README.md) · [Siguiente: Cómo funciona el proyecto →](05-como-funciona-el-proyecto.md)

## Dos roles, una misma aplicación

En este repositorio **la misma aplicación NestJS** puede ejecutarse en varios puertos. Según cómo la configures, una instancia hará de **coordinador**, otra de **participante**, o ambas cosas a nivel de código (siempre expone los dos tipos de endpoints).

En la práctica, al probar el proyecto tú decides:

| Instancia | Puerto típico | Rol principal | Archivo de configuración |
|-----------|---------------|---------------|--------------------------|
| Coordinador | 3000 | Inicia transacciones y habla con los participantes | `.env.coordinator.example` |
| Participante 1 | 3001 | Recibe prepare / commit / abort | `.env.participant.example` |
| Participante 2 | 3002 | Igual que el 1, con otro puerto y otra base de datos | Copia del participante cambiando `PORT` |

## El coordinador

**Responsabilidad:** dirigir la transacción global.

1. Recibe una petición del usuario: *"ejecuta la transacción tx-001"*.
2. En la **fase 1**, llama por HTTP a cada participante configurado en `PARTICIPANTS`.
3. Cuenta los votos.
4. En la **fase 2**, envía `commit` o `abort` a todos.
5. Devuelve el resultado final.

**Endpoint principal:**

```
POST /coordinator/execute
Body: { "transactionId": "tx-001" }
```

**Variable clave en su `.env`:**

```env
PARTICIPANTS=http://localhost:3001,http://localhost:3002
```

Es la lista de direcciones donde viven los participantes.

## El participante

**Responsabilidad:** votar en la fase 1 y aplicar la decisión en la fase 2.

Cada participante tiene **su propia base de datos PostgreSQL**. Guarda un registro por transacción con su estado (`PREPARED`, `COMMITTED`, `ABORTED`).

**Endpoints:**

| Ruta | Fase | Qué hace |
|------|------|----------|
| `POST /transaction/prepare` | 1 | Guarda estado PREPARED y vota COMMIT o ABORT |
| `POST /transaction/commit` | 2 | Cambia el estado a COMMITTED |
| `POST /transaction/abort` | 2 | Cambia el estado a ABORTED |

El participante **no decide solo** si la transacción global se confirma: solo vota en la fase 1 y obedece al coordinador en la fase 2.

## Cómo se hablan entre sí

Todo ocurre por **HTTP** (peticiones web entre programas):

```
Tú (curl o Postman)
    │
    ▼
Coordinador :3000
    │
    ├──► Participante :3001/transaction/prepare
    ├──► Participante :3002/transaction/prepare
    │
    ├──► Participante :3001/transaction/commit  (o abort)
    └──► Participante :3002/transaction/commit  (o abort)
```

No hay mensajería mágica: son llamadas REST normales, como cuando un navegador pide una página a un servidor.

## ¿Por qué una base de datos por participante?

En un sistema distribuido real, cada servicio suele tener **sus propios datos**. Simular varias bases de datos muestra que:

- Cada nodo es independiente.
- Hace falta un protocolo para mantener coherencia entre ellos.
- Un fallo en un nodo no debe dejar a los demás en un estado imposible de entender.

Para una demo local con dos participantes, el segundo participante puede usar otro puerto de PostgreSQL (por ejemplo 5433) si levantas un segundo contenedor.

## Resumen visual

```
┌─────────────────┐
│  COORDINADOR    │  "¿Todos listos? → Entonces confirmen"
│  puerto 3000    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Part.1 │ │ Part.2 │
│ :3001  │ │ :3002  │
│  DB 1  │ │  DB 2  │
└────────┘ └────────┘
```

---

[Siguiente: Cómo funciona este proyecto →](05-como-funciona-el-proyecto.md)
