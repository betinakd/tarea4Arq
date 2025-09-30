# Fábrica de Bebidas Energéticas - API con Redis y BullMQ

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io-static/v1?style=for-the-badge&message=express&color=000000&logo=express&logoColor=white&label=)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io-badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io-badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)

Este proyecto implementa una API REST para simular la gestión de una fábrica de bebidas energéticas. Utiliza **Node.js** y **TypeScript** con el framework **Express** para el servidor web. La persistencia de datos y la gestión de colas de trabajo asíncronas se realizan con **Redis** y **BullMQ**.

El sistema permite gestionar un inventario de ingredientes, recibir pedidos de bebidas, validar la disponibilidad de ingredientes y procesar la producción de forma asíncrona, actualizando el estado del pedido en tiempo real.

## ✨ Características Principales

-   **Gestión de Inventario**: Añadir y consultar ingredientes en el inventario almacenado en Redis (usando Sorted Sets).
-   **Recepción de Pedidos**: Crear nuevos pedidos de bebidas a través de un endpoint de la API.
-   **Validación de Stock**: Antes de aceptar un pedido, el sistema verifica si hay suficientes ingredientes en el inventario.
-   **Procesamiento Asíncrono**: Los pedidos aceptados se añaden a una cola de producción (`BullMQ`) para ser procesados por un worker en segundo plano.
-   **Actualización de Estado**: El estado de un pedido (`pending`, `in_production`, `completed`, `rejected`) se actualiza en tiempo real en Redis.
-   **Contenedorización**: El entorno de desarrollo (Redis y Redis Commander) se gestiona fácilmente con **Docker Compose**.
-   **Testing**: Incluye tests unitarios para los servicios utilizando **Jest**.

## 🚀 Requisitos Previos

-   [Node.js](httpss://nodejs.org/) (v18 o superior)
-   [Docker](httpss://www.docker.com/products/docker-desktop/) y Docker Compose

## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd tarea4Arq
    ```

2.  **Instalar dependencias del proyecto:**
    ```bash
    npm install
    ```

3.  **Crear el archivo de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y configúralo. Puedes usar el siguiente como base:
    ```env
    # Puerto para la API
    PORT=3000

    # Configuración de Redis
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

4.  **Iniciar los servicios de Docker:**
    Este comando levantará los contenedores de Redis y Redis Commander.
    ```bash
    docker-compose up -d
    ```
    -   **Redis** estará disponible en el puerto `6379`.
    -   **Redis Commander** (interfaz gráfica para Redis) estará disponible en `http://localhost:8081`.

## ▶️ Ejecutar la Aplicación

Para iniciar el servidor en modo de desarrollo (con recarga automática):

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

## 🧪 Ejecutar los Tests

Para ejecutar la suite de tests unitarios configurada con Jest:

```bash
npm test
```

Para ejecutar los tests en modo "watch" (se re-ejecutan al detectar cambios):

```bash
npm run test:watch
```

## 📂 Estructura del Proyecto

```
tarea4Arq/
├── src/
│   ├── config/         # Configuración de conexiones (Redis).
│   ├── controllers/    # Controladores que manejan la lógica de las rutas.
│   ├── middelware/     # Middlewares de Express (ej. errorHandler).
│   ├── models/         # Interfaces y tipos de datos (Order, Ingredient, etc.).
│   ├── routes/         # Definición de las rutas de la API.
│   └── services/       # Lógica de negocio (interacción con Redis, BullMQ).
├── tests/              # Tests unitarios con Jest.
├── utils/              # Clases de utilidad (ej. ApiError).
├── docker-compose.yml  # Orquestación de contenedores de Redis.
├── index.ts            # Punto de entrada de la aplicación Express.
├── jest.config.cjs     # Configuración de Jest.
└── tsconfig.json       # Configuración del compilador de TypeScript.
```

## 📖 Endpoints de la API

Puedes importar la colección `Redis Bull.postman_collection.json` en Postman para probar fácilmente los endpoints.

### Ingredientes

-   `POST /ingredients`
    -   Añade un nuevo ingrediente al inventario.
    -   **Body**: `{ "name": "azucar", "amount": 500 }`

-   `POST /ingredients/set-random`
    -   Inicializa el inventario con ingredientes y cantidades aleatorias.

### Bebidas

-   `POST /drinks/order`
    -   Crea un nuevo pedido de bebida. El sistema valida el stock y, si es exitoso, lo encola para producción.
    -   **Body**: `{ "orderId": "unique-order-123", "drinkType": "cosmic_punch", "quantity": 5 }`

-   `GET /drinks/order/:orderId`
    -   Consulta el estado de un pedido específico.

-   `GET /drinks/total/:drinkType`
    -   Obtiene la cantidad total producida de un tipo de bebida.

## 🛠️ Flujo de Trabajo del Pedido

1.  **Cliente envía Pedido**: Un cliente hace una petición `POST /drinks/order`.
2.  **Validación Inicial**: El `drinkService` verifica si hay suficientes ingredientes (`enoughIngredients`).
    -   Si no hay stock, el pedido se rechaza con un error 400.
    -   Si hay stock, el pedido se guarda en Redis con estado `pending`.
3.  **Encolado**: El pedido se añade a la cola de producción `production-queue` de BullMQ.
4.  **Procesamiento del Worker**:
    -   Un `worker` de BullMQ toma el pedido de la cola.
    -   El estado del pedido se actualiza a `in_production`.
    -   Se simula un tiempo de producción (ej. 3 segundos).
    -   El `drinkService` descuenta los ingredientes del inventario (`createDrinkByOrder`).
    -   El `drinkTotalService` incrementa el contador de bebidas producidas.
    -   El estado del pedido se actualiza a `completed`.
5.  **Consulta de Estado**: El cliente puede consultar el estado final del pedido en cualquier momento con `GET /drinks/order/:orderId`.