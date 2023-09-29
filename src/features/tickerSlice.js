import { createSlice } from '@reduxjs/toolkit';

export const tickerSlice = createSlice({
  name: 'pairs',
  initialState: [],
  reducers: {
    addPair: (state, action) => {
      const { symbol, channelId } = action.payload;
      const existingPair = state.find((pair) => pair.symbol === symbol);

      if (!existingPair) {
        state.push({ symbol, channelId });
      } else {
        existingPair.channelId = channelId;
      }
    },

    updatePair: (state, action) => {
      // Update a pairs data based on the channelId
      const { channelId, ...updateData } = action.payload;

      const pairToUpdate = state.find((pair) => pair.channelId === channelId);

      if (pairToUpdate) {
        Object.assign(pairToUpdate, updateData);
      }
    },
  },
});

export const { addPair, updatePair } = tickerSlice.actions;

export default tickerSlice.reducer;
