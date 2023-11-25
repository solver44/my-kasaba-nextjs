import { findSTIR } from "@/http/kasaba";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { tin } = req.body;
      let data = await findSTIR(tin);
      if (data && typeof data == "string") {
        const cleanedString = data.replace(/\\"/g, '"');
        data = JSON.parse(cleanedString);
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "An error occurred", message: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}