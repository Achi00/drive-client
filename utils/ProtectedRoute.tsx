import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "@/pages/api/auth/auth";
import Loading from "@/components/Loading";

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
        console.log(
          "getting user session from protexted route " +
            JSON.stringify(userSession)
        );

        if (!userSession || userSession.error) {
          console.log(
            "you will be redirected because userSession not exists ot there is error"
          );
          setIsLoading(false);
          router.push("/login?error=Not%20Authenticated");
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log("Error getting user session:", error);
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
