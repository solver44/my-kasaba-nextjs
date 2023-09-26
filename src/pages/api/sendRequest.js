import { sendApplication } from "@/http/kasaba";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { token, data } = req.body;
      const isValid = await verifyRecaptcha(token);
      if (isValid !== true) {
        res.status(498).json({
          error: "reCAPTCHA verification failed",
          codes: isValid?.error,
        });
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
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

  const response = await fetch(url, {
    method: "POST",
  });

  const data = await response.json();

  // Check if reCAPTCHA verification was successful
  if (data?.success) {
    return true; // reCAPTCHA was successfully validated
  } else {
    return { error: (data || {})["error-codes"] }; // reCAPTCHA verification failed
  }
}
