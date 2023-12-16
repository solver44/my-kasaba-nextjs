import { $axios } from ".";

export async function getDBOBT() {
  try {
    const { data } = await $axios.get(`/rest/entities/HDbobt`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getSOATO() {
  try {
    const { data } = await $axios.get(`/rest/services/classifiers/soato`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getOPF() {
  try {
    const { data } = await $axios.get(`/rest/entities/HOpf`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getOwnership() {
  try {
    const { data } = await $axios.get(`/rest/entities/HOwnership`);

    return data;
  } catch (error) {
    return error;
  }
}
