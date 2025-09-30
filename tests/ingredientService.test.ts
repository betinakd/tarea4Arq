import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 1. Mockear el módulo ANTES de cualquier importación
jest.mock('../src/config/redis.js', () => ({
  // El mock debe coincidir con la estructura de exportación (default)
  __esModule: true, // Necesario para mocks de ES Modules
  default: {
    zAdd: jest.fn(),
    zScore: jest.fn(),
    zRangeWithScores: jest.fn(),
  }
}));

// 2. Importar los módulos DESPUÉS de haberlos mockeado
import client from '../src/config/redis.js';
import { addIngredient, setRandomIngredient } from '../src/services/ingredientService.js';

// 3. Forzar el tipo del cliente para que TypeScript entienda que es un mock
const mockedClient = client as jest.Mocked<typeof client>;

describe('IngredientService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('addIngredient', () => {
    it('debería agregar un ingrediente correctamente', async () => {
      const ingredient = { name: 'azucar', amount: 100 };
      
      // Ahora puedes usar los métodos de mock directamente
      mockedClient.zAdd.mockResolvedValue(1);

      await addIngredient(ingredient);

      expect(mockedClient.zAdd).toHaveBeenCalledWith(
        'ingredient_inventory',
        expect.objectContaining({ value: 'azucar', score: 100 })
      );
    });
  });
});