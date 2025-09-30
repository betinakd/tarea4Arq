# Fábrica de Bebidas Energéticas - API con Redis y BullMQ

Resumen
-------
API REST en TypeScript/Node que simula la gestión de una fábrica de bebidas energéticas. Usa Redis para persistencia y BullMQ para procesamiento asíncrono de pedidos. Contiene servicios para inventario (ingredientes), creación y procesamiento de pedidos, y conteo de bebidas producidas.

Tecnologías
----------
- Node.js + TypeScript
- Express (servidor)
- Redis (datos y colas)
- BullMQ (cola de producción)
- Jest (tests)
- Docker / Docker Compose (Redis + Redis Commander)

Requisitos
---------
- Node.js v18+
- Docker + Docker Compose (opcional para Redis)
- npm

Instalación
----------
```bash
git clone <repo-url>
cd tarea4Arq
npm install
cp .env.example .env
```

Variables de entorno (.env)
---------------------------
Ejemplo mínimo:
```
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

Arrancar Redis (opcional con Docker)
-----------------------------------
```bash
docker-compose up -d
# Redis Commander disponible en http://localhost:8081
```

Ejecutar la aplicación
----------------------
Modo desarrollo:
```bash
npm run dev
```
Build y producción:
```bash
npm run build
npm start
```
API disponible en: `http://localhost:3000`

Endpoint disponible
-------------------
Solo un endpoint público para crear pedidos:

- POST /drinks/order  
  Crea un pedido y lo encola para producción.

  Body (ejemplo):
  ```json
  {
    "orderId": "unique-order-123",
    "drinkType": "cosmic_punch",
    "quantity": 5
  }
  ```

  Respuestas típicas:
  - 201: pedido aceptado/enqueued
  - 400: validación (p. ej. stock insuficiente o ID duplicado)

Estructura del proyecto
-----------------------
```
tarea4Arq/
├── index.ts
├── src/
│   ├── config/redis.ts
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── ingredientService.ts
│   │   ├── drinkService.ts
│   │   ├── drinkTotalService.ts
│   │   └── bullQueueService.ts
│   ├── models/
│   └── middelware/
├── tests/
│   └── ingredientService.test.ts
├── docker-compose.yml
├── jest.config.cjs
├── tsconfig.json
└── .env.example
```

Modelos (resumen)
-----------------
- Ingredient:
```ts
interface Ingredient {
  name: string;
  amount: number;
}
```
- Order:
```ts
interface Order {
  orderId: string;
  drinkType: string;
  quantity: number;
  status?: string;
}
```
- DrinkRecipe:
```ts
interface DrinkRecipe {
  [ingredientName: string]: number;
}
```

Flujo de pedido (resumen)
-------------------------
1. Cliente POST /drinks/order.
2. Servicio valida stock (enoughIngredients).
3. Si hay stock: guarda/cola pedido con estado `pending`.
4. Worker procesa: marca `in_production`, descuenta ingredientes, incrementa totales y marca `completed`.
5. Si falla validación o procesamiento: pedido marcado `rejected`.

Testing
-------
Ejecutar tests unitarios:
```bash
npm test
```
Config de Jest: `jest.config.cjs` (ts-jest, ESM ready). Tests en `tests/*.test.ts`.

Scripts relevantes (package.json)
--------------------------------
- npm run dev — desarrollo
- npm run build — compilar
- npm start — ejecutar build
- npm test — ejecutar tests

Docker Compose (resumen)
------------------------
Archivo `docker-compose.yml` incluye servicios:
- redis:6379
- redis-commander:8081

Comandos:
```bash
docker-compose up -d
docker-compose down
```

Notas y recomendaciones
-----------------------
- Asegúrate de que Redis esté accesible según las variables en `.env`.
- Los tests mockean Redis; al ejecutar integration tests reales activa Redis/containers.
- Si usas ESM y ts-jest, el script de test debe lanzar Jest con `--experimental-vm-modules` (ya configurado en package.json del proyecto).

Contribuir
----------
1. Fork
2. Nueva rama: git checkout -b feature/mi-cambio
3. Commit & PR

Licencia
--------
MIT

Contacto
-------
Repositorio y documentación en el propio proyecto.  
(README simplificado para estar en un único archivo).