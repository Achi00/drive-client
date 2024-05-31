import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import {
  ActivityIcon,
  GlobeIcon,
  HardDrive,
  History,
  HomeIcon,
  LayoutGridIcon,
  MenuIcon,
  MountainIcon,
  Server,
  Star,
  Trash2,
  UsersIcon,
} from "lucide-react";
import User from "./User";
import { UserProps } from "@/types";

export default function Sidebar({ user }: UserProps) {
  if (!user) {
    return null;
  }
  return (
    <div className="flex h-screen">
      <div className="hidden lg:block lg:w-64 ">
        <div className="fixed lg:shrink-0 lg:border-r lg:bg-gray-100 dark:lg:bg-gray-800 flex h-full flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <Link
              className="flex items-center gap-2 font-bold"
              href="/dashboard"
            >
              <h2 className="text-lg flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100 sm:text-sm">
                <Server />
                Drive
              </h2>
            </Link>
            <nav className="flex-1 space-y-2 pl-4 py-4">
              <Link
                className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                href="/dashboard"
              >
                <HardDrive className="h-5 w-5" />
                <span className="sm:hidden md:inline">My Drive</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                href="#"
              >
                <Star className="h-5 w-5" />
                <span className="sm:hidden md:inline">Starred</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                href="#"
              >
                <History className="h-5 w-5" />
                <span className="sm:hidden md:inline">Recent</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                href="/trash"
              >
                <Trash2 className="h-5 w-5" />
                <span className="sm:hidden md:inline">Trash</span>
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <Button className="w-full" size="sm" variant="outline">
              Upgrade to Pro
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <User user={user} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
          <div className="flex items-center justify-between">
            <Sheet>
              <div className="flex flex-col items-center">
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation</span>
                  </Button>
                </SheetTrigger>
                <nav className="space-y-2 py-4">
                  <Link
                    className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                    href="#"
                  >
                    <HardDrive className="h-5 w-5" />
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                    href="#"
                  >
                    <Star className="h-5 w-5" />
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                    href="#"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                    href="#"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Link>
                </nav>
              </div>
              <SheetContent className="w-64" side="left">
                <div className="flex h-full flex-col justify-between py-6 px-4">
                  <h2 className="text-lg flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100 sm:text-sm">
                    <Server />
                    Drive
                  </h2>
                  <div className="space-y-6">
                    <nav className="flex-1 space-y-2 py-4">
                      <Link
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                        href="#"
                      >
                        <HardDrive className="h-5 w-5" />
                        <span>My Drive</span>
                      </Link>
                      <Link
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                        href="#"
                      >
                        <Star className="h-5 w-5" />
                        <span>Starred</span>
                      </Link>
                      <Link
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                        href="#"
                      >
                        <History className="h-5 w-5" />
                        <span>Recent</span>
                      </Link>
                      <Link
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-2 sm:text-sm"
                        href="#"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Trash</span>
                      </Link>
                    </nav>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full" size="sm" variant="outline">
                      Upgrade to Pro
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User user={user} />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>
    </div>
  );
}
