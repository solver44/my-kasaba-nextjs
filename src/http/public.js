import { $axios, $publicAxios } from ".";

export async function fetchSTIR(value) {
  if (value?.length < 9) return;
  try {
    const data = await $publicAxios.post("/stir", {
      tin: value,
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function fetchPINFL(value, givenDate) {
  if (value?.length < 14) return { data: { success: false } };
  try {
    const data = await $publicAxios.post("/pinfl", {
      pinfl: value,
      givenDate,
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function sendApplicationViaBack(data, token) {
  try {
    const { data: dataResponse } = await $publicAxios.post("/sendRequest", {
      data,
      token,
    });
    return dataResponse;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function checkStatusApplication(code) {
  try {
    const { data } = await $axios.get("/rest/services/application/check", {
      params: { code },
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function getBranches() {
  try {
    const { data } = await $axios.get("/rest/services/classifiers/branchs");
    return data;
  } catch (error) {
    return [];
  }
}

export async function getRegions() {
  try {
    const { data } = await $axios.get("/rest/services/classifiers/regions");
    return data;
  } catch (error) {
    return [];
  }
}

export async function getDistricts(regionId) {
  if (!regionId) return false;
  try {
    const { data } = await $axios.get("/rest/services/classifiers/districts", {
      params: { regionId },
    });
    return data;
  } catch (error) {
    return [];
  }
}
