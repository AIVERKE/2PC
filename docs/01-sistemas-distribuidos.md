# 1. ¿Qué es un sistema distribuido?

[← Índice](README.md) · [Siguiente: Transacciones →](02-transacciones.md)

## Una computadora vs muchas

Cuando usas una app en el móvil, detrás suele haber **varios programas corriendo en distintas máquinas** (servidores). Cada máquina tiene su propia memoria y su propia base de datos. Juntas forman un **sistema distribuido**.

Piensa en una cadena de tiendas:

- Cada sucursal tiene su propio almacén (su propia base de datos).
- La oficina central coordina pedidos entre sucursales.
- Si vendes el último producto en la sucursal A, la sucursal B no lo sabe al instante.

Eso es distribución: **datos repartidos en varios sitios** que deben coordinarse.

## ¿Por qué no usar una sola máquina?

| Ventaja de distribuir | Ejemplo |
|-----------------------|---------|
| Más capacidad | Miles de usuarios a la vez |
| Menos riesgo si falla una parte | Si cae un servidor, otros siguen |
| Cercanía al usuario | Servidores en distintos países |

## El problema principal: la coordinación

Cuando todo está en **un solo ordenador**, es fácil: un programa escribe en una base de datos y listo.

Cuando hay **varios ordenadores**, surgen preguntas difíciles:

1. **¿Cómo sabemos que todos hicieron lo mismo?**  
   Un servidor puede guardar un pago y otro no, por un fallo de red.

2. **¿Qué pasa si uno falla a mitad de camino?**  
   Algunos nodos creen que la operación terminó y otros no.

3. **¿En qué orden ocurren las cosas?**  
   Dos usuarios pueden modificar el mismo dato casi al mismo tiempo.

Los **protocolos de consenso** y las **transacciones distribuidas** existen para responder a esas preguntas. Este proyecto enseña uno de ellos: el **Two-Phase Commit (2PC)**.

## Analogía del mundo real

Organizar una cena con amigos en tres ciudades distintas:

- Todos deben confirmar asistencia **antes** de reservar el restaurante.
- Si uno no puede ir, cancelas la reserva para no pagar de más.
- Necesitas un **coordinador** (quien organiza) y **participantes** (cada amigo en su ciudad).

Esa coordinación entre varias partes es exactamente lo que modela un sistema distribuido con 2PC.

## En este proyecto

Corremos **varias instancias** de la misma aplicación NestJS:

- Una actúa principalmente como **coordinador** (quien inicia la transacción).
- Otras actúan como **participantes** (quienes votan y guardan el resultado en su base de datos).

Cada participante tiene su propia base de datos PostgreSQL. El coordinador les pregunta y luego les dice a todos que confirmen o cancelen.

---

[Siguiente: ¿Qué es una transacción? →](02-transacciones.md)
