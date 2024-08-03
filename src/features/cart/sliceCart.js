import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      if (
        state.cart.map((item) => item.pizzaId).includes(action.payload.pizzaId)
      ) {
        const item = state.cart.find(
          (item) => item.pizzaId === action.payload.pizzaId
        );
        item.quantity++;
        console.log("tedad :", item.quantity, item.unitPrice);
        item.totalPrice = item.quantity * item.unitPrice;
        return;
      }
      state.cart = [...state.cart, action.payload];
      // state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItem(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.unitPrice * item.quantity;
      console.log(state.cart);
    },
    decreaseItem(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--
     
      if(item.quantity === 0){
        cartSlice.caseReducers.deleteItem(state,action)
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});
export default cartSlice.reducer;
export const { addItem, deleteItem, increaseItem, decreaseItem, clearCart } =
  cartSlice.actions;

export const getTotalPrice = (state) => {
  // return state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  return state.cart.cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
};

export const getTotalQuantity = (state) => {
  return state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
};

export const getCart = (state) => state.cart.cart;
export const getUserName = (state) => state.user.username;
export const getCurrentQuantityById = (id) => (state) => {
  return state.cart.cart.find((item) => item.pizzaId === id)?.quantity || 0;
};

// error vojod dard
