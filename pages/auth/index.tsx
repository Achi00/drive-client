import { GetServerSideProps } from "next";
import api from "../api/axios";
import { getSession } from "../api/auth/auth";
import { UserProps, userTypes } from "@/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getSession(context);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default function Home({ user }: any) {
  return (
    <div>
      <h1>Welcome, {user && user.name}</h1>
    </div>
  );
}
