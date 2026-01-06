import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  email: string;
  fullName: string;
  role: string | null;
  id?: number;
};

type UserState = {
  userData: UserData | null;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  userData: null,
  isAuthenticated: false,
};

// Load userData from localStorage on initialization
const loadUserDataFromStorage = (): UserData | null => {
  try {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      return JSON.parse(userDataStr);
    }
  } catch (err) {
    console.error("Error loading user data from storage:", err);
  }
  return null;
};

// Initialize with data from localStorage if available
const initialUserData = loadUserDataFromStorage();
if (initialUserData) {
  initialState.userData = initialUserData;
  initialState.isAuthenticated = !!localStorage.getItem("authToken");
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      // Sync with localStorage
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
        // Sync with localStorage
        localStorage.setItem("userData", JSON.stringify(state.userData));
      }
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    },
  },
});

export const { setUserData, updateUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;

