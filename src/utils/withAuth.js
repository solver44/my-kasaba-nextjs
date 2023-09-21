import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; // Import useState
import Loader from "@/components/Loader";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate an asynchronous check for login status
    setTimeout(() => {
      setLoading(false); // Set loading to false after a delay
    }, 0); // Adjust the delay as needed

    // Check if the user is not logged in and redirect
    if (!isLoggedIn) {
      router.push("/auth"); // Replace with your login route
    }
  }, [isLoggedIn, router]);

  if (loading) {
    // Display a loading indicator while checking login status
    return <Loader />;
  }

  return children;
};

export const LoginRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate an asynchronous check for login status
    setTimeout(() => {
      setLoading(false); // Set loading to false after a delay
    }, 0); // Adjust the delay as needed

    // Check if the user is logged in and redirect
    if (isLoggedIn) {
      router.push("/"); // Replace with your login route
    }
  }, [isLoggedIn, router]);

  if (loading) {
    // Display a loading indicator while checking login status
    return <Loader />;
  }

  return children;
};


export default PrivateRoute;