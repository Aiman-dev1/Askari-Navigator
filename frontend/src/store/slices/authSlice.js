import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, storeSession, clearSession, getStoredUser, getToken } from "../../lib/api";
import { disconnectSocket } from "../../lib/socket";

export const DEFAULT_TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "apex-tower";

// Helper function
const finishLogin = (data) => {
  disconnectSocket();
  storeSession(data.token, data.user);
  return data.user;
};

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      try {
        const response = await api.post("/auth/login", { email, password });
        return finishLogin(response);
      } catch {
        const response = await api.post("/auth/login", { email, password, tenantSlug: DEFAULT_TENANT_SLUG });
        return finishLogin(response);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        tenantSlug: DEFAULT_TENANT_SLUG,
      });
      return finishLogin(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const guestLogin = createAsyncThunk(
  "auth/guestLogin",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/guest", { username, tenantSlug: DEFAULT_TENANT_SLUG });
      return finishLogin(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUsername = createAsyncThunk(
  "auth/updateUsername",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.patch("/auth/me", { username });
      return finishLogin(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: getStoredUser(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      disconnectSocket();
      clearSession();
      state.user = null;
      state.isAuthenticated = false;
    },
    syncSession: (state) => {
      state.user = getStoredUser();
      state.isAuthenticated = !!getToken();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Guest Login
      .addCase(guestLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(guestLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Username
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, syncSession } = authSlice.actions;

export const homeRouteFor = (user) => {
  if (user?.role === "super_admin") return "/super-admin";
  if (user?.role === "tenant_admin") return "/building-admin";
  return "/user";
};

export default authSlice.reducer;
