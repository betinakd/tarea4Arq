import express from 'express';
import drinksRoutes from './src/routes/drinks.js';
import { errorHandler } from './src/middelware/errorHandler.js';
import { setRandomIngredient } from './src/services/ingredientService.js';

const app = express();

app.use(express.json());
app.use(drinksRoutes);

app.use(errorHandler);

setRandomIngredient();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});