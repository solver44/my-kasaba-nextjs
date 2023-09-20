import { findPINFL } from "@/http/kasaba";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { pinfl, givenDate } = req.body;
      const data = await findPINFL(pinfl, givenDate);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const data = { status: "ok", pinfl };
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "An error occurred", message: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
