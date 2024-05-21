import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function Upload() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Upload to Google Drive</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Drag and drop a file to upload to your Google Drive storage.
        </p>
      </div>
      <div className="space-y-4">
        <div className="group relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-colors hover:border-primary hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary dark:hover:bg-gray-700">
          <input
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            id="file"
            type="file"
          />
          <div className="z-20 flex flex-col items-center justify-center space-y-2 text-gray-500 transition-colors group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary">
            <CloudUploadIcon className="h-8 w-8" />
            <p>Drag and drop a file or click to select</p>
          </div>
        </div>
        <Progress value={50} />
        <Button className="w-full" type="submit">
          Upload
        </Button>
      </div>
    </div>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

export default Upload;
