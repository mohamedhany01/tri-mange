import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ProductServices from "@/firebase/services/product";
import Product from "@/types/Product";

export interface ProductState {
  products: Record<string, Product>;
}

const initialState: ProductState = {
  products: {},
};

export const getAllProducts = createAsyncThunk("get/all/products", async () => {
  return await ProductServices.fetchAllProducts();
});

export const addOneProduct = createAsyncThunk(
  "add/one/product",
  async (product: Omit<Product, "id">) => {
    return await ProductServices.addNewProduct(product);
  },
);

export const updateOneProduct = createAsyncThunk(
  "update/one/product",
  async ({ id, product }: { id: string; product: Partial<Product> }) => {
    return await ProductServices.updateProduct(id, product);
  },
);

export const deleteOneProduct = createAsyncThunk(
  "delete/one/product",
  async (productId: string) => {
    return await ProductServices.deleteProduct(productId);
  },
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    removeProductsUsingClientId: (state, action) => {
      const clientId = action.payload;

      state.products = Object.keys(state.products).reduce(
        (acc, productId) => {
          const product = state.products[productId];
          if (product.clientId !== clientId) {
            acc[productId] = product;
          }
          return acc;
        },
        {} as Record<string, Product>,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(addOneProduct.fulfilled, (state, action) => {
      state.products = {
        [action.payload.id]: action.payload,
        ...state.products,
      };
    });
    builder.addCase(updateOneProduct.fulfilled, (state, action) => {
      state.products[action.payload.id] = action.payload;
    });
    builder.addCase(deleteOneProduct.fulfilled, (state, action) => {
      const deletedProductId = action.payload;
      const { [deletedProductId]: _, ...remainingProducts } = state.products;
      state.products = remainingProducts;
    });
  },
});

// Export the actions and reducer
export const { removeProductsUsingClientId } = productSlice.actions;
export default productSlice.reducer;
