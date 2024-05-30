import "@/styles/globals.css";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const unprotectedRoutes = ["/file/[id]"];

  const isProtectedRoute = !unprotectedRoutes.includes(router.pathname);

  return (
    <>
      {isProtectedRoute ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
