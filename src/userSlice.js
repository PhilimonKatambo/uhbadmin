import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || {
      firstName: "",
      surName: "",
      userId: "",
      userEmail: "",
      userPassword: "",
      userRole: "",
      loggedIn: false
    }
  },
  reducers: {
    login: (state, action) => {
      state.user = {
        ...action.payload,
        loggedIn: true
      };
      localStorage.setItem("user", JSON.stringify(state.user)); // ✅ save to localStorage
    },
    logout: (state) => {
      state.user = {
        firstName: "",
        surName: "",
        userId: "",
        userEmail: "",
        userPassword: "",
        userRole: "",
        loggedIn: false
      };
      localStorage.removeItem("user");
      
    },
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
