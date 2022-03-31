/* eslint-disable global-require */
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

// MUI
import { ThemeProvider } from "@material-ui/core/styles";
import { dark as darkTheme } from "src/themes/dark";
import CssBaseline from "@material-ui/core/CssBaseline";

// components
import { ErrorPopupContainer } from "src/components";
import App from "./App";
import store from "./store";

// context
import { ErrorProvider } from "src/hooks/useError";
import { Web3ContextProvider } from "src/hooks/web3Context";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ErrorProvider>
          <Web3ContextProvider>
            <Provider store={store}>
              <BrowserRouter basename={"/"}>
                <App />
              </BrowserRouter>
            </Provider>
          </Web3ContextProvider>
          <ErrorPopupContainer />
        </ErrorProvider>
      </ThemeProvider>
    );
  }
}
