# 2. ¿Qué es una transacción?

[← Sistemas distribuidos](01-sistemas-distribuidos.md) · [Índice](README.md) · [Siguiente: Protocolo 2PC →](03-protocolo-dos-fases.md)

## La regla de "todo o nada"

Una **transacción** es un conjunto de pasos que deben cumplirse **todos juntos** o **ninguno**.

### Ejemplo: transferencia bancaria

Quieres pasar 100 € de la cuenta A a la cuenta B. El banco hace dos cosas:

1. Restar 100 € de A.
2. Sumar 100 € a B.

Si solo ocurre el paso 1, pierdes dinero. Si solo ocurre el paso 2, el banco regala dinero. **Eso no puede pasar.**

La transacción garantiza:

- **Commit (confirmar):** ambos pasos se aplican.
- **Rollback (deshacer):** si algo falla, se revierte todo como si no hubiera pasado nada.

## Propiedades ACID (versión sencilla)

En bases de datos se habla de **ACID**. No hace falta memorizarlas; basta con la idea:

| Letra | Significado simple |
|-------|-------------------|
| **A**tomicidad | Todo o nada |
| **C**onsistencia | Los datos siguen teniendo sentido (no hay saldos negativos imposibles) |
| **I**solación | Dos operaciones a la vez no se pisan de forma extraña |
| **D**urabilidad | Si se confirmó, el dato queda guardado aunque se apague el servidor |

Este proyecto se centra sobre todo en la **atomicidad** repartida entre varios nodos.

## Transacción local vs transacción distribuida

| Tipo | Dónde ocurre | Ejemplo |
|------|--------------|---------|
| **Local** | Una sola base de datos | Restar y sumar en el mismo banco |
| **Distribuida** | Varias bases de datos o servicios | Restar en el banco A y sumar en el banco B |

En una transacción **distribuida** no hay un único "botón" que controle todo. Hace falta un **protocolo** para que todos los nodos coincidan: confirmar juntos o cancelar juntos.

## Estados de una transacción en este proyecto

Cada participante guarda en su base de datos en qué punto está la transacción:

```
PREPARED  →  listo para confirmar, esperando decisión del coordinador
COMMITTED →  confirmada definitivamente
ABORTED   →  cancelada
```

`PREPARED` es la fase intermedia: "estoy dispuesto a confirmar si el coordinador lo ordena".

## Por qué importa para sistemas distribuidos

Sin un protocolo claro, podrías tener:

- Nodo 1 confirmó el cambio.
- Nodo 2 falló antes de confirmar.
- El sistema queda **inconsistente**: mitad hecho, mitad no.

El **Two-Phase Commit** evita eso pidiendo acuerdo antes de confirmar en todos lados.

---

[Siguiente: Protocolo de dos fases →](03-protocolo-dos-fases.md)
