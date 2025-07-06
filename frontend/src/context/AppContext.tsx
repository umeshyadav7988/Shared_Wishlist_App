import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Wishlist } from '../types';
import { authAPI, wishlistAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface WishlistState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
}

interface AppState {
  auth: AuthState;
  wishlists: WishlistState;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' };

type WishlistAction =
  | { type: 'WISHLIST_LOADING' }
  | { type: 'SET_WISHLISTS'; payload: Wishlist[] }
  | { type: 'SET_CURRENT_WISHLIST'; payload: Wishlist | null }
  | { type: 'ADD_WISHLIST'; payload: Wishlist }
  | { type: 'UPDATE_WISHLIST'; payload: Wishlist }
  | { type: 'DELETE_WISHLIST'; payload: string }
  | { type: 'WISHLIST_ERROR' };

type AppAction = AuthAction | WishlistAction;

const initialState: AppState = {
  auth: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    isAuthenticated: false,
  },
  wishlists: {
    wishlists: [],
    currentWishlist: null,
    isLoading: false,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
        },
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          token: action.payload.token,
          isLoading: false,
          isAuthenticated: true,
        },
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        },
        wishlists: {
          wishlists: [],
          currentWishlist: null,
          isLoading: false,
        },
      };
    case 'WISHLIST_LOADING':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          isLoading: true,
        },
      };
    case 'SET_WISHLISTS':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          wishlists: action.payload,
          isLoading: false,
        },
      };
    case 'SET_CURRENT_WISHLIST':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          currentWishlist: action.payload,
          isLoading: false,
        },
      };
    case 'ADD_WISHLIST':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          wishlists: [action.payload, ...state.wishlists.wishlists],
          isLoading: false,
        },
      };
    case 'UPDATE_WISHLIST':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          wishlists: state.wishlists.wishlists.map((w) =>
            w._id === action.payload._id ? action.payload : w
          ),
          currentWishlist: state.wishlists.currentWishlist?._id === action.payload._id
            ? action.payload
            : state.wishlists.currentWishlist,
          isLoading: false,
        },
      };
    case 'DELETE_WISHLIST':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          wishlists: state.wishlists.wishlists.filter((w) => w._id !== action.payload),
          currentWishlist: state.wishlists.currentWishlist?._id === action.payload
            ? null
            : state.wishlists.currentWishlist,
          isLoading: false,
        },
      };
    case 'WISHLIST_ERROR':
      return {
        ...state,
        wishlists: {
          ...state.wishlists,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadWishlists: () => Promise<void>;
  loadWishlist: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        socketService.connect(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login({ email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } });
      socketService.connect(response.token);
      
      toast.success('Login successful!');
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register({ username, email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token: response.token } });
      socketService.connect(response.token);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const loadWishlists = async (): Promise<void> => {
    try {
      dispatch({ type: 'WISHLIST_LOADING' });
      const response = await wishlistAPI.getWishlists();
      dispatch({ type: 'SET_WISHLISTS', payload: response.wishlists });
    } catch (error: any) {
      dispatch({ type: 'WISHLIST_ERROR' });
      toast.error(error.response?.data?.message || 'Failed to load wishlists');
    }
  };

  const loadWishlist = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'WISHLIST_LOADING' });
      const response = await wishlistAPI.getWishlist(id);
      dispatch({ type: 'SET_CURRENT_WISHLIST', payload: response.wishlist });
    } catch (error: any) {
      dispatch({ type: 'WISHLIST_ERROR' });
      toast.error(error.response?.data?.message || 'Failed to load wishlist');
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      login,
      register,
      logout,
      loadWishlists,
      loadWishlist,
    }}>
      {children}
    </AppContext.Provider>
  );
};
