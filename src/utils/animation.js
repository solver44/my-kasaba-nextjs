export async function getAnimation() {
  if (typeof window !== "undefined") {
    const autoAnimate = await import("@formkit/auto-animate");
    return autoAnimate.default;
  } else {
    return () => {};
  }
}

export async function getImportViewer() {
  if (typeof window !== "undefined") {
    const webviewer = await import("@pdftron/webviewer");
    return webviewer.default;
  } else {
    return () => {};
  }
}
