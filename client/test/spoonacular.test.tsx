import { testJSON } from './spoonacular_data';
import { getRecipesBulk } from '../src/thirdparty-api-formatting'

describe('Data retrieval from thirdparty API test', () => {
  test('Data formatting', (done) => {
    try {
      getRecipesBulk(testJSON).then((response) => {
        expect(response[0]).toBeDefined
        expect(response[1]).toBeDefined
        expect(response[2]).toBeDefined
      })

    } catch (error) {
      console.error(error)
    }
    done()
  });
});

