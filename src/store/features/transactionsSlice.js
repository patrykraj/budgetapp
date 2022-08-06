import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";
import { userId } from "../../static/constants";

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  () => {
    return client
      .get(`transactions?budgetId=${userId}&_expand=category`)
      .then((res) => res.json())
      .catch((err) => err.message);
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    spentAmount: {},
    isTransactionsLoading: false,
    errorMessage: null,
  },
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: {
    [getTransactions.pending]: (state) => {
      state.isLoading = true;
      if (state.errorMessage) state.errorMessage = null;
    },
    [getTransactions.fulfilled]: (state, { payload }) => {
      const spentValues = payload.reduce(
        (acc, transaction) => {
          acc.parentCategories.totalSpent += transaction.amount;
          if (
            acc[transaction.categoryId] ||
            acc.parentCategories[transaction.category?.parentCategoryId]
          ) {
            if (acc[transaction.categoryId])
              acc[transaction.categoryId] += transaction.amount;
            else acc[transaction.categoryId] = transaction.amount;
            if (acc.parentCategories[transaction.category.parentCategoryId])
              acc.parentCategories[transaction.category.parentCategoryId] +=
                transaction.amount;
            else
              acc.parentCategories[transaction.category.parentCategoryId] =
                transaction.amount;
            return { ...acc };
          }
          return {
            ...acc,
            [transaction.categoryId]: transaction.amount,
            parentCategories: {
              ...acc.parentCategories,
              [transaction.category.parentCategoryId]: transaction.amount,
            },
          };
        },
        {
          parentCategories: {
            totalSpent: 0,
          },
        }
      );

      state.spentAmount = spentValues;
      state.transactions = payload;
      state.isLoading = false;
    },
    [getTransactions.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const { setTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
