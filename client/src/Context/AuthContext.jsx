// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getProfile, setAuthToken } from '../lib/api/authApi';
import { getRolePermissions } from '../lib/api/roleApi';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  allowedPages: [], // Array<string>: pages allowed for current user's role
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        allowedPages: [],
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'SET_ALLOWED_PAGES':
      return {
        ...state,
        allowedPages: action.payload,
      };
    case 'USER_UPDATED':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUserAndPermissions();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    // eslint-disable-next-line
  }, []);

  const loadUserAndPermissions = async () => {
    try {
      const { data: user } = await getProfile();
      

      const allRolesPerms = await getRolePermissions(); // [{role:'staff', pages: [...]}, ...]

      // 🔧 SAFEGUARD: Check against missing or malformed roles
      const currentRole = user?.role;
      const matchedPerm = allRolesPerms?.find(p => p.role === currentRole);

      const allowedPages = (currentRole === 'admin')
        ? ['*'] // ✅ Admin has access to everything
        : matchedPerm?.pages || [];

      console.log('Allowed Pages for role:', currentRole, '=>', allowedPages);

      dispatch({ type: 'USER_LOADED', payload: user });
      dispatch({ type: 'SET_ALLOWED_PAGES', payload: allowedPages });
    } catch (error) {
      console.error('Auth error:', error.message);
      dispatch({ type: 'AUTH_ERROR' });
      setAuthToken(null);
    }
  };

  const hasRole = (roles) => {
    if (!state.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    return roleArray.includes(state.user.role);
  };

  const hasPermission = (resource) => {
    if (!state.user || !resource) return false;
    if (state.user.role === 'admin') return true;
    return state.allowedPages.includes(resource);
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    window.location.href = "/login";
  };

  const updateUser = (userData) => {
    dispatch({ type: 'USER_UPDATED', payload: userData });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      dispatch,
      hasPermission,
      hasRole,
      logout,
      updateUser,
      loadUser: loadUserAndPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
