const { addIngredient, setRandomIngredient } = require('../src/services/ingredientService');
const client = require('../src/config/redis');
const { ApiError } = require('../utils/ApiError');

// Mock Redis client
jest.mock('../src/config/redis', () => ({
  zAdd: jest.fn(),
  zScore: jest.fn(),
  zRangeWithScores: jest.fn(),
}));

describe('IngredientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests aquí
  it('should add ingredient', async () => {
    client.zAdd.mockResolvedValue(1);
    await addIngredient({name: 'test', amount: 10});
    expect(client.zAdd).toHaveBeenCalled();
  });
});