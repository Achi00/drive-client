// components/ProtectedRoute.js
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "@/pages/api/auth/auth";

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
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
