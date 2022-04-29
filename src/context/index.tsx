import { ReactNode } from "react";
import { AuthProvider } from "./auth-content";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
