import { refreshToken } from "@/http/kasaba";
import { writeJSONFile } from "@/utils/jsonUtils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await refreshToken();
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const data = { status: "ok", pinfl };
      const tokens = data;
      if (tokens?.access_token) {
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
        await writeJSONFile({ accessToken, refreshToken });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "An error occurred", message: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
