import LayoutComponent from "@/components/Layout/_base";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/components/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LayoutComponent>
        <Component {...pageProps} />;
      </LayoutComponent>
    </AuthProvider>
  )
}
