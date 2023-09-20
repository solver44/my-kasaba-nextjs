import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth"); // Replace with your login route
    }
  }, []);

  return children;
};

export const LoginRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/"); // Replace with your login route
    }
  }, []);

  return children;
};

export default PrivateRoute;
