import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// redux store
import { Provider } from "react-redux";
import store from "./store";

// context
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { SocketContextProvider } from "./context/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>
);
