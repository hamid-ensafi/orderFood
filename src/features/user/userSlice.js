import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "./../../services/apiGeocoding";

// async function fetchAddress() {
//   // 1) We get the user's geolocation position

// }

export const fetchAddress = createAsyncThunk("user/fetchaddress", async function () {
  function getPosition() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
      console.log('kar mikonad')
    });
  }
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  return { position, address };
});

const initialState = {
  username: "",
  status: "idle",
  error: "",
  address: "",
  position: {},
};
const userSlice = createSlice({
  name: "username",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.position = action.payload.position;
        state.address = state.payload.address;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      }),
});
export default userSlice.reducer;
export const { updateName } = userSlice.actions;
