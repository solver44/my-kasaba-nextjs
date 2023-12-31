import axios from "axios";
import { $axios, BASE_URL } from ".";

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
      BASE_URL + "/oauth/token",
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

export async function findBKUT(tin) {
  try {
    const request = {
      filter: {
        conditions: [
          {
            property: "eLegalEntity.tin",
            operator: "=",
            value: tin,
          },
        ],
      },
    };
    const { data } = await $axios.post("/rest/entities/EBKUT/search", request, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    return error; // { status: error?.status, message: error?.message };
  }
}

export async function findSTIR(tin) {
  try {
    const { data } = await $axios.get("/integration/legal-entity", {
      params: { tin },
      headers: {"Content-Type": "application/json"}
    },);
    return data;
  } catch (error) {
    return { status: error?.status, message: error?.message };
  }
}

export async function sendApplication(_data) {
  try {
    const { pinfl, tin, phone, givenDate, branchId, email, comment, soatoId } =
      _data;

    // Define the request payload as a separate object for clarity
    const requestData = branchId
      ? {
          application: {
            pinfl,
            tin,
            phone,
            givenDate,
            email,
            branch: {
              id: branchId,
            },
            soato: {
              id: soatoId,
            },
            comment,
          },
        }
      : {
          application: {
            pinfl,
            tin,
            phone,
            givenDate,
            email,
            soato: {
              id: soatoId,
            },
            comment,
          },
        };

    // Make the POST request using axios
    const response = await $axios.post(
      "/rest/services/application/apply",
      requestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (error) {
    // Handle the error and provide a meaningful response
    return { status: error?.status, message: error?.message };
  }
}
