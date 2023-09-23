import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"; // Import useState
import Loader from "@/components/Loader";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth"); // Replace with your login route
    }
    setTimeout(
      () => {
        setLoading(false);
      },
      isLoggedIn ? 0 : 100
    );
  }, [isLoggedIn, router]);

  return (
    <React.Fragment>
      {loading && <Loader />}
      {children}
    </React.Fragment>
  );
};

export const LoginRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/"); // Replace with your login route
    }
  }, [isLoggedIn, router]);

  return children;
};

export default PrivateRoute;
