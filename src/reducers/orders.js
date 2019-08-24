import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

export default (state = [], action) => {
  switch (action.type) {
    case 'CREATE_NEW_ORDER':
      const { id, recipe } = action.payload;
      return [
        ...state,
        {
          id,
          recipe,
          position: 'clients',
          ingredients: []
        }
      ];
    case 'MOVE_ORDER_NEXT':
      return state.map(order => {
        if (order.id === action.payload) {
          if (order.position !== 'clients') {
            const nums = order.position.match(/(?<=_)[\d]+/g);
            const position = parseInt(nums.join(''));
            if (position < 4) {
              return {
                ...order,
                position: `conveyor_${position + 1}`
              };
            } else if (position === 4 && order.ingredients.length === 4) {
              return {
                ...order,
                position: 'finish'
              };
            }
          } else {
            return {
              ...order,
              position: `conveyor_1`
            };
          }
        }
        return order;
      });
    case 'MOVE_ORDER_BACK':
      return state.map(order => {
        if (order.id === action.payload) {
          const nums = order.position.match(/(?<=_)[\d]+/g);
          const position = parseInt(nums.join(''));
          if (position > 1) {
            return {
              ...order,
              position: `conveyor_${position - 1}`
            };
          }
        }
        return order;
      });
    case 'ADD_INGREDIENT':
      const { from, ingredient } = action.payload;
      return state.map(order => {
        const ingredientInRecipe = order.recipe.some(
          item => item === ingredient
        );
        if (order.position === from && ingredientInRecipe) {
          return {
            ...order,
            ingredients: [...order.ingredients, ingredient]
          };
        }
        return order;
      });
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
