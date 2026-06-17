# Documentación del proyecto

Bienvenido. Esta carpeta explica, con palabras sencillas, qué son los **sistemas distribuidos** y cómo funciona el protocolo **Two-Phase Commit (2PC)** que implementa este repositorio.

No necesitas experiencia previa en programación distribuida. Lee los documentos en orden o salta al que te interese.

## Índice

| # | Documento | Qué aprenderás |
|---|-----------|----------------|
| 1 | [¿Qué es un sistema distribuido?](01-sistemas-distribuidos.md) | Por qué existen varios servidores y qué problemas aparecen |
| 2 | [¿Qué es una transacción?](02-transacciones.md) | La idea de "todo o nada" en una operación |
| 3 | [Protocolo de dos fases (2PC)](03-protocolo-dos-fases.md) | Cómo varios nodos deciden juntos confirmar o cancelar |
| 4 | [Coordinador y participante](04-roles-coordinador-participante.md) | Los dos roles que interactúan en este proyecto |
| 5 | [Cómo funciona este proyecto](05-como-funciona-el-proyecto.md) | Qué hace cada parte del código y cada petición HTTP |
| 6 | [Guía de inicio paso a paso](06-guia-de-inicio.md) | Cómo descargar, configurar y probar el proyecto |
| 7 | [Glosario](07-glosario.md) | Definiciones rápidas de términos usados |

## Archivos de configuración incluidos

En la raíz del proyecto encontrarás dos plantillas listas para copiar:

| Archivo | Para qué sirve |
|---------|----------------|
| [`.env.coordinator.example`](../.env.coordinator.example) | Configuración del **nodo coordinador** |
| [`.env.participant.example`](../.env.participant.example) | Configuración de un **nodo participante** |

Consulta la [guía de inicio](06-guia-de-inicio.md) para ver cómo usarlos.

## Resumen en una frase

Imagina que varias personas deben firmar el mismo contrato al mismo tiempo: primero todas dicen si están de acuerdo (**fase 1**), y solo si todas aceptan se firma definitivamente; si alguien se niega, se cancela todo (**fase 2**). Eso es, en esencia, el Two-Phase Commit.
