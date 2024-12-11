import LayoutComponent from "@/components/Layout/_base";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutComponent>
      <Component {...pageProps} />;
    </LayoutComponent>
  )
}
