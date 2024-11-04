// In your Next.js frontend component
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleAlert, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 hidden xl:flex lg:flex bg-zinc-900 p-12 text-white flex-col justify-between">
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
      <div className="xl:w-1/2 lg:w-1/2 w-full flex items-center justify-center p-12">
        <div className="w-full max-w-md flex flex-col gap-10 items-center justify-center">
          <div className="p-5 w-2/3">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <AlertDialog>
            <Alert className="max-w-md">
              <AlertTitle className="flex items-center gap-2 mb-2">
                <CircleAlert className="h-5 w-5" />
                <span className="font-semibold">Permissions needed!</span>
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  To provide seamless access and editing capabilities, this app
                  requires certain{" "}
                  <span className="font-bold">Google account</span> permissions.
                </p>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    Show Permissions
                  </Button>
                </AlertDialogTrigger>
              </AlertDescription>
            </Alert>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Why We Need These Permissions
                </AlertDialogTitle>
                <AlertDialogDescription>
                  To provide seamless access and editing capabilities, this app
                  requires the following permissions. Here’s why each permission
                  is necessary:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Alert>
                <AlertTitle className="flex items-center gap-2 mb-2">
                  <CircleAlert className="h-5 w-5" />
                  <span className="font-semibold">Important!</span>
                </AlertTitle>
                <AlertDescription>
                  This app only accesses files you created from this
                  application, we don't have access on any of your{" "}
                  <span className="font-semibold">Google drive </span>
                  or <span className="font-semibold">Google docs</span> files,
                  this permissions are used to make app work.
                </AlertDescription>
              </Alert>

              <ul className="space-y-4 text-xs xl:text-md lg:text-md md:text-sm sm:text-xs mb-4 list-disc list-inside">
                <li>
                  <strong>
                    See, edit, create, and delete Google Docs files thich where
                    created from this app:{" "}
                  </strong>
                  This permission allows you to edit your uploaded text files
                  with google docs, after you click button{" "}
                  <span className="font-semibold">Edit With Docs </span>
                  we create file copy on google docs and google drive to make
                  file editable and be sure that you will not lost file if you
                  lost connection or app crashes.
                </li>
                <li>
                  <strong>
                    See, edit, create, and delete all your Google Docs
                    documents:
                  </strong>
                  This access lets you edit text files within Google Docs,
                  enabling real-time collaboration and continuity. You can start
                  editing a file here and pick up exactly where you left off in
                  Google Docs. If you delete text file which was edited with{" "}
                  <span className="font-semibold">Google Docs </span>file will
                  be only deleted on this app
                </li>
                <li>
                  <strong>
                    Associate your Google account with your personal info:
                  </strong>
                  This is required to connect your Google account with this app
                  securely, ensuring that only you have access to your files and
                  personal settings.
                </li>
                <li>
                  <strong>
                    See your personal info, including publicly available
                    details:
                  </strong>
                  Used solely for identification purposes to personalize your
                  experience within the app. We do not store or share this data.
                </li>
                <li>
                  <strong>
                    View your primary Google Account email address:
                  </strong>
                  This enables us to link your account for secure access and to
                  provide support if you encounter issues. We won’t use or share
                  your email for other purposes.
                </li>
              </ul>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Log in</h2>
              <p className="mt-2 text-sm text-gray-600">
                Authenticate to get access on website
              </p>
            </div>
            <form
              className="mb-0 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
              </div>
              <div>
                <Button
                  className="w-full hover:bg-black hover:text-white bg-white text-gray-700 border border-gray-300 shadow-sm"
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="mr-2 h-4 w-4" />
                  <span>Login with Google</span>
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
