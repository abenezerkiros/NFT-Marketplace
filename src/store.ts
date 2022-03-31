import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/AccountSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
import nftReducer from "./slices/NFTsSlice";
import marketReducer from "./slices/MarketplaceSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    pendingTransactions: pendingTransactionsReducer,
    nft: nftReducer,
    market: marketReducer,
  },
  middleware: (getDefaultMiddleware: (arg0: { serializableCheck: boolean }) => any) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
