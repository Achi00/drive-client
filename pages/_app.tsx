import "@/styles/globals.css";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
}

export default MyApp;
