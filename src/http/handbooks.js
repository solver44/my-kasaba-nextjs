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

export async function getIFUT() {
  try {
    const { data } = await $axios.get(`/rest/entities/HOked`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getXXTUT() {
  try {
    const { data } = await $axios.get(`/rest/entities/HOkonx`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getSettings() {
  try {
    const { data } = await $axios.get(`/rest/entities/Settings`, {
      params: {
        limit: 1,
      },
    });
    return data;
  } catch (error) {
    return error;
  }
}
