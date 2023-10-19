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
export async function getPositions() {
  try {
    const { data } = await $axios.get(`/rest/entities/HBkutEmployeePosition`);
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

export async function getEmployee(data, isPost) {
  try {
    let response1;
    const { data: _data } = await $axios.post(
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
    response1 = _data;

    if (isPost) {
      // if (response1?.length > 0) {
      //   response1 = response1[0];
      // } else {
      response1 = (
        await $axios.post("/rest/entities/HIndividual", data, {
          headers: { "Content-Type": "application/json" },
        })
      ).data;
      // }
    }

    return response1;
  } catch (error) {
    return error;
  }
}

export async function sendEmployee(_data, employees = []) {
  try {
    let result;
    let response1 = await getEmployee(_data, true);
    const { fio, firstName, lastName, middleName, phone, email, ...data } =
      _data;

    const requestData = {
      id: data.bkutId,
      ...data,
      employees: [
        ...employees.map((e) => ({
          position: {
            id: e.position.id,
          },
          employee: {
            id: e.employee.id,
          },
          bkut: {
            id: data.bkutId,
          },
          phone: e.phone,
          email: e.email,
        })),
        {
          position: {
            id: data.position,
          },
          employee: {
            id: response1.id,
          },
          bkut: {
            id: data.bkutId,
          },
          phone,
          email,
        },
      ],
    };
    result = await sendEBKUT(requestData);

    return result;
  } catch (error) {
    return error;
  }
}

export async function sendMember(requestData, data, oldMembers = []) {
  try {
    let result;
    let response1 = await getEmployee(data, true);

    const memberId = response1.id;
    requestData.members[0].member.id = memberId;
    requestData.members.unshift(...oldMembers);
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
