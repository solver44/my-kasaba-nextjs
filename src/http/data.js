import { $axios } from ".";

export async function getBKUTID(login, password) {
  try {
    const { data } = await $axios.get("/rest/services/bkut/get", {
      params: { email: login, password },
    });
    return data;
  } catch (error) {
    return error;
  }
}
export async function getBKUTData(id) {
  try {
    const bkutId = id ?? localStorage.getItem("token");
    const { data } = await $axios.get(`/rest/entities/EBKUT/${bkutId}`, {
      params: { fetchPlan: "bkut-register" },
    });
    const { data: data2 } = await $axios.get(`/rest/entities/EBKUT/${bkutId}`, {
      params: { fetchPlan: "bkut-cabinet" },
    });
    return { ...data2, ...data };
  } catch (error) {
    return error;
  }
}

export async function initFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await $axios.post(`/rest/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
}
export async function getFile(fileRef) {
  try {
    const { data } = await $axios.get(`/rest/files/`, {
      params: { fileRef },
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function sendDepartment(data) {
  try {
    const { data: response } = await $axios.post(
      "/rest/entities/EBkutDepartment",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}
export async function sendEBKUT(data) {
  try {
    const { data: response } = await $axios.post("/rest/entities/EBKUT", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}

export async function getEmployee(data) {
  try {
    const { data: response1 } = await $axios.post(
      "/rest/entities/HIndividual/search",
      {
        filter: {
          conditions: [
            {
              property: "pinfl",
              operator: "=",
              value: data.pinfl,
            },
          ],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response1;
  } catch (error) {
    return error;
  }
}

export async function sendEmployee(data) {
  try {
    let result;
    let response1 = await getEmployee(data);

    if (response1?.length > 0) {
    } else {
      await $axios.post("/rest/entities/HIndividual", data, {
        headers: { "Content-Type": "application/json" },
      });
      response1 = await getEmployee(data);
    }
    const requestData = {
      id: data.bkutId,
      employees: [
        {
          position: {
            id: data.position,
          },
          employee: {
            id: response1[0].id,
          },
          bkut: {
            id: data.bkutId,
          },
        },
      ],
    };
    result = await sendEBKUT(requestData);

    return result;
  } catch (error) {
    return error;
  }
}

export async function sendMember(requestData, data) {
  try {
    let result;
    let response1 = await getEmployee(data);

    if (response1?.length > 0) {
    } else {
      await $axios.post("/rest/entities/HIndividual", data, {
        headers: { "Content-Type": "application/json" },
      });
      response1 = await getEmployee(data);
    }
    const memberId = response1[0].id;
    requestData.members[0].member.id = memberId;
    result = await sendEBKUT(requestData);

    return result;
  } catch (error) {
    return error;
  }
}
export async function fetchMember(id) {
  try {
    const { data } = await $axios.get("/rest/entities/EMembers/" + id);

    return data;
  } catch (error) {
    return error;
  }
}
