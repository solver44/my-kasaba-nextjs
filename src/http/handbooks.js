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
    const request = {
      filter: {
        conditions: [
          {
            property: "okonx",
            operator: "notEmpty",
          },
          {
            property: "nameRu",
            operator: "notEmpty",
          },
        ],
      },
    };
    const { data } = await $axios.post(`/rest/entities/HOked/search`, request, {
      headers: { "Content-Type": "application/json" },
    });

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

export async function getFixedAssetType() {
  try {
    const { data } = await $axios.get(`/rest/entities/HFixedAssetType`);

    return Array.isArray(data) ? data : [];
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
