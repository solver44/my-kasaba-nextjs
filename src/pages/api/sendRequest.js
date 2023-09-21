import { sendApplication } from "@/http/kasaba";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { token, data } = req.body;
      const isValid = await verifyRecaptcha(token);
      if (!isValid) {
        res.status(498).json({ error: "reCAPTCHA verification failed'" });
      }
      const response = await sendApplication(data);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const data = { status: "ok", pinfl };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "An error occurred", message: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

async function verifyRecaptcha(token) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=6LeWaT4oAAAAAIWmh0s5zR4fAGQlsBLxDr_gViQj&response=${token}`;

  const response = await fetch(url, {
    method: "POST",
  });

  const data = await response.json();

  // Check if reCAPTCHA verification was successful
  if (data?.success) {
    return true; // reCAPTCHA was successfully validated
  } else {
    return false; // reCAPTCHA verification failed
  }
}
