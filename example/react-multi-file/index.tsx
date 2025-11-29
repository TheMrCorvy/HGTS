/**
 * React application with separated configuration
 * This demonstrates how to setup i18n in a separate file for React apps
 */

import React from "react";
import ReactDOM from "react-dom";
import { hgts } from "hgts";

// Configure i18n BEFORE rendering the app
hgts.setup({
  resources: {
    en: {
      app: {
        title: "My Application",
        description: "Multi-file i18n example",
      },
      nav: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
      messages: {
        zero: "No messages",
        one: "{{count}} message",
        other: "{{count}} messages",
      },
    },
    es: {
      app: {
        title: "Mi Aplicación",
        description: "Ejemplo de i18n multi-archivo",
      },
      nav: {
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
      },
      messages: {
        zero: "Sin mensajes",
        one: "{{count}} mensaje",
        other: "{{count}} mensajes",
      },
    },
  },
  defaultLocale: "en",
});

// Import App component AFTER configuration
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
