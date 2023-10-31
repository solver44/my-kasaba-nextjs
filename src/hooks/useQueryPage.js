import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useQueryPage(initial) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const addQueryToCurrentURL = (queryObject, notRenew) => {
    const mergedQuery = notRenew
      ? { ...queryObject, ...router.query }
      : { ...router.query, ...queryObject };

    const updatedURL = {
      pathname: "", // router.asPath.split("?")[0], // Extract pathname without query
      query: mergedQuery,
    };

    router.push(updatedURL, undefined, { shallow: true });
  };

  useEffect(() => {
    if (typeof initial !== "object") return;
    addQueryToCurrentURL(initial, true);
  }, []);

  return { addQueryToCurrentURL, router, searchParams };
}
