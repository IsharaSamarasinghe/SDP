import { createBrowserRouter } from "react-router-dom";

import {HomePage} from "../../pages/public/HomePage";
import {AboutPage} from "../../pages/public/AboutPage";
import {ConferencesPage} from "../../pages/public/ConferencesPage";
import {ContactPage} from "../../pages/public/ContactPage";
import {LoginPage} from "../../pages/public/LoginPage";
import {RegistrationPage} from "../../pages/public/RegistrationPage";
import Privacy from "../../pages/public/Privacy";
import Terms from "../../pages/public/Terms";

export const router = createBrowserRouter([
  { path: "/home", element: <HomePage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/about", element: <AboutPage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/conferences", element: <ConferencesPage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/contact", element: <ContactPage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/login", element: <LoginPage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/register", element: <RegistrationPage onNavigate={function (_page: string): void {
      throw new Error("Function not implemented.");
  } } /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
]);
