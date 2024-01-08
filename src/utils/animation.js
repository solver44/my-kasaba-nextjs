export async function getAnimation() {
  if (typeof window !== "undefined") {
    const autoAnimate = await import("@formkit/auto-animate");
    return autoAnimate.default;
  } else {
    return () => {};
  }
}
