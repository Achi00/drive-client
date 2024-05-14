// components/ProtectedRoute.js
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, logout } from "@/pages/api/auth/auth";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userSession = await getSession();
        if (!userSession) {
          router.push("/login?error=NotAuthenticated");
          logout();
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
        logout();
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};

export default ProtectedRoute;
