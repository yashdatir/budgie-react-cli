'use strict';

// ─── src/store/index.ts ───────────────────────────────────────────────────────
function makeStore() {
  return `import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in these action types if needed
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}

// ─── src/store/rootReducer.ts ─────────────────────────────────────────────────
function makeRootReducer() {
  return `import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  // ↑ Add more slice reducers here as your app grows
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
`;
}

// ─── src/features/counter/counterSlice.ts ─────────────────────────────────────
function makeCounterSlice() {
  return `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  // Example of handling async thunks:
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchCountAsync.pending, (state) => { state.status = 'loading'; })
  //     .addCase(fetchCountAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value = action.payload;
  //     })
  //     .addCase(fetchCountAsync.rejected, (state) => { state.status = 'failed'; });
  // },
});

export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions;

// Selectors
export const selectCount = (state: { counter: CounterState }) => state.counter.value;
export const selectStatus = (state: { counter: CounterState }) => state.counter.status;

export default counterSlice.reducer;
`;
}

// ─── src/hooks/index.ts ───────────────────────────────────────────────────────
function makeHooksTsx() {
  return `import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

/**
 * Use these typed hooks throughout your app instead of plain useDispatch / useSelector.
 *
 * @example
 *   const dispatch = useAppDispatch();
 *   const count = useAppSelector((state) => state.counter.value);
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
}

module.exports = { makeStore, makeRootReducer, makeCounterSlice, makeHooksTsx };
