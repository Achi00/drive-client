// pages/_app.tsx

import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { userTypes } from "@/types"; // Adjust the import path accordingly
import ProtectedRoute from "@/utils/ProtectedRoute";

interface MyAppProps extends AppProps {
  user: userTypes;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const unprotectedRoutes = ["/file/[id]"];

  const isProtectedRoute = !unprotectedRoutes.includes(router.pathname);

  return (
    <div className="flex">
      <Sidebar user={pageProps.user} />
      <main className="flex-grow">
        {isProtectedRoute ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </div>
  );
}

export default MyApp;
