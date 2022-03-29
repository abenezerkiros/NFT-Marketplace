import { createContext, useReducer, useContext } from "react";

// constants
export enum ErrorType {
  Error,
  Warning,
}

const ErrorStateContext = createContext({ errors: [] });
const ErrorDispatchContext = createContext(null);

// @ts-ignore
function ErrorReducer(state, action) {
  switch (action.type) {
    case "ADD_ERROR": {
      return {
        ...state,
        errors: [...state.errors, action.error],
      };
    }
    case "REMOVE_ERROR": {
      const updatedErrors = state.errors.filter((e: { id: string }) => e.id != action.id);
      return {
        ...state,
        errors: updatedErrors,
      };
    }
    default:
      return state;
  }
}

// @ts-ignore
export function ErrorProvider({ children }) {
  const [state, dispatch] = useReducer(ErrorReducer, {
    errors: [],
  });

  return (
    <ErrorStateContext.Provider value={state}>
      {/* @ts-ignore */}
      <ErrorDispatchContext.Provider value={dispatch}>{children}</ErrorDispatchContext.Provider>
    </ErrorStateContext.Provider>
  );
}

export const useError = (autoclose = false, delay = 4000) => {
  const dispatch = useErrorDispatchContext();

  return ({ type = ErrorType.Error, message }: { type?: ErrorType; message: string }) => {
    const id = Math.random().toString(36).substr(2, 9);
    // @ts-ignore
    dispatch({
      type: "ADD_ERROR",
      error: {
        type,
        message,
        id,
      },
    });

    if (autoclose) {
      setTimeout(() => {
        // @ts-ignore
        dispatch({ type: "REMOVE_ERROR", id });
      }, delay);
    }
  };
};

export const useErrorStateContext = () => useContext(ErrorStateContext);
export const useErrorDispatchContext = () => useContext(ErrorDispatchContext);
