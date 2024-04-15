import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { LoginUserAction } from "./store/actions/AuthActions.ts";
import { store } from "./store/store.ts";
import "bootstrap-icons/font/bootstrap-icons.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthUserActionType } from "./entities/Auth.ts";
import { ComparisonProvider } from "./store/reducers/comparisonReducer .tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

if (localStorage.token) {
  LoginUserAction(
    store.dispatch,
    localStorage.token,
    AuthUserActionType.LOGIN_USER,
  );
}

root.render(
  <GoogleOAuthProvider clientId="351896808559-9djdo2gtp7r5cpo3qmir29ir55fpa1de.apps.googleusercontent.com">
    <Provider store={store}>
      <ComparisonProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ComparisonProvider>
    </Provider>
  </GoogleOAuthProvider>,
);
