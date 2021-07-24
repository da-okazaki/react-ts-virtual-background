import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './app/store';

import { Provider } from 'react-redux';
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "antialiased",
        },
        body: {
          margin: 0,
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: "lighter",
          lineHeight: 1.5,
          overflow: "hidden",
        },
        "#app-root": {
          overflow: "hidden",
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
    ,
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
