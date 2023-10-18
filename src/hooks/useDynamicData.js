import { getPositions } from "@/http/data";
import { useEffect, useState } from "react";

export default function useDynamicData({ positions }) {
  const [data, setData] = useState();
  useEffect(() => {
    async function fetchData() {
      const _data = (await getPositions()) ?? [];
      setData(
        _data.map((d) => ({
          value: d.id,
          label: d.nameUz,
          labelRu: d.nameRu ?? "",
        }))
      );
    }
    fetchData();
  }, []);

  return [data];
}
