import React from "react";
import { Button } from "./ui/button";
import { UserProps, userTypes } from "@/types";
import { logout } from "@/pages/api/auth/auth";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut } from "lucide-react";

const handleLogout = async () => {
  await logout();
};

const User = ({ user }: UserProps) => {
  return (
    <Card className="w-full py-1">
      <CardContent className="flex justify-center items-center gap-4 py-1 px-3">
        <Avatar>
          <AvatarImage alt="drive" src={user.photoUrl} />
          <AvatarFallback>{user.displayName}</AvatarFallback>
        </Avatar>
        <div className="font-medium">{user.displayName}</div>
        <Button onClick={handleLogout}>
          <LogOut width={20} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default User;
