import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { CurrentUserProvider } from "./context/CurrentUserContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { SalesProvider } from "./context/SalesContext";
createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-4ox86uw3ji0xmnlk.us.auth0.com"
    clientId="hgCpvIQX1Pep3gJk0W4v4Hj9XYezQdyg"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <CurrentUserProvider>
    <SalesProvider>
      <ProductProvider>
        
        <App />
         
      </ProductProvider>
      </SalesProvider>
    </CurrentUserProvider>
  </Auth0Provider>
);
