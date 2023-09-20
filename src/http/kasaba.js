import axios from "axios";
import { $axios } from ".";

export async function findPINFL(pinfl, givenDate) {
  try {
    const { data } = await $axios.get("/integration/passport", {
      params: { pinfl, givenDate },
    });
    return data;
  } catch (error) {
    return { status: error?.status, message: error?.message };
  }
}

export async function refreshToken(
  username = "frontoffice",
  password = "6yvqwfzPVU7mUvw"
) {
  try {
    const { data } = await axios.post(
      "http://test.kasaba.uz:8000/oauth/token",
      {
        grant_type: "password",
        username,
        password,
      },
      {
        headers: {
          Authorization: "Basic Y2xpZW50OnNlY3JldA==",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data;
  } catch (error) {
    return { status: error?.status, message: error?.message };
  }
}

export async function findSTIR(tin) {
  try {
    const { data } = await $axios.get("/integration/legal-entity", {
      params: { tin },
    });
    return data;
  } catch (error) {
    return { status: error?.status, message: error?.message };
  }
}
