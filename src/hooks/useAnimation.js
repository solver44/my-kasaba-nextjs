const { getAnimation } = require("@/utils/animation");
const { useEffect, useRef } = require("react");

export default function useAnimation() {
  const parent = useRef();

  useEffect(() => {
    parent.current &&
      getAnimation().then((func) => {
        func(parent.current);
      });
  }, [parent.current]);

  return parent;
}
