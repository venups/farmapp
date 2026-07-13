import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

interface AppState {
  globalLoading: boolean;
}

type AppAction = { type: 'SET_LOADING'; payload: boolean };

interface AppStateType extends AppState {
  setGlobalLoading: (loading: boolean) => void;
}

const initialState: AppState = {
  globalLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, globalLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<AppStateType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setGlobalLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setGlobalLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
