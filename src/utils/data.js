export function generateUniqueId(length = 9) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function showOrNot(text) {
  const result = (text || "").trim();
  if (!result) return "not-found";
  return result;
}

export function getBearerToken(req) {
  return (req.headers?.Authorization || " ").split(" ")[1];
}
