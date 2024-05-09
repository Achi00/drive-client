// In your Next.js frontend component
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import error from "next/error";

const LoginButton = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

function LoginForm() {
  const router = useRouter();
  const { error } = router.query;
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 hidden xl:flex lg:flex bg-zinc-900 p-12 text-white  flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Server className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-semibold">Drive</h1>
        </Link>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li className="scroll-m-20 xl:text-xl lg:text-md font-semibold tracking-tight">
            <strong>Google Cloud Integration:</strong> Store your files securely
            in the cloud with Google Cloud Storage, ensuring fast access and
            robust data protection.
          </li>
          <li className="scroll-m-20 xl:text-xl lg:text-md font-semibold tracking-tight">
            <strong>File Uploads:</strong> Easily upload your files directly to
            specific folders and manage them through a user-friendly interface.
          </li>
          <li className="scroll-m-20 xl:text-xl lg:text-md font-semibold tracking-tight">
            <strong>Authentication Protection:</strong> Access your files
            securely with authentication protocols ensuring that only you can
            access your data.
          </li>
          <li className="scroll-m-20 xl:text-xl lg:text-md font-semibold tracking-tight">
            <strong>File Previews:</strong> Quickly view your files online
            without the need to download them, supporting common formats like
            JPEG, PNG, PDF, and plain text.
          </li>
          <li className="scroll-m-20 xl:text-xl lg:text-md font-semibold tracking-tight">
            <strong>Hierarchical File Management:</strong> Organize your files
            with ease using folders and subfolders, just like on your personal
            computer.
          </li>
        </ul>
      </div>
      <div className="xl:w-1/2 lg:w-1/2 w-full  flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="p-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Log in</h2>
              <p className="mt-2 text-sm text-gray-600">
                Authenticate to get access on website
              </p>
            </div>
            <form className="mb-0 space-y-6">
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
              </div>
              <div>
                <Button className="w-full hover:bg-black hover:text-white bg-white text-gray-700 border border-gray-300 shadow-sm">
                  <FaGoogle className="mr-2 h-4 w-4" />
                  <span>
                    <a href="http://localhost:8080/auth/google">
                      Login with Google
                    </a>
                  </span>
                </Button>
              </div>
            </form>
            <p className="mt-6 text-xs text-gray-500">
              By clicking continue, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginButton;
