import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module } from "../../api/modulesApi";

type ModulesState = {
  modules: Module[];
  loading: boolean;
  error: string | null;
};

const initialState: ModulesState = {
  modules: [],
  loading: false,
  error: null,
};

export const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
      state.error = null;
    },
    addModule: (state, action: PayloadAction<Module>) => {
      state.modules.push(action.payload);
    },
    removeModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter((module) => module.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setModules, addModule, removeModule, setLoading, setError } = modulesSlice.actions;
export default modulesSlice.reducer;
