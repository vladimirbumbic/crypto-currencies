import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

import loginReducer from '../features/loginSlice';
import tickerReducer from '../features/tickerSlice';
import favoritesSlice from '../features/favoritesSlice';

const persistConfig = { key: 'root', version: 1, storage };

const reducer = combineReducers({
  login: loginReducer,
  ticker: tickerReducer,
  favorites: favoritesSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
