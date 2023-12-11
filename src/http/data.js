import { saveAs } from "file-saver";
import { $axios, BASE_URL } from ".";

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
      params: { fetchPlan: "bkut-cabinet" },
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function downloadFile(file, name) {
  try {
    const url = `/rest/files?fileRef=${encodeURIComponent(
      file
    )}&attachment=false`;
    const response = await $axios.get(url);
    console.log(response);
    const blob = new Blob([response.data], {
      type: response.headers["Content-Type"],
    });
    saveAs(blob, name);
    return true;
  } catch (e) {
    console.log(e);
    return false;
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
    const { data } = await $axios.get(`/rest/entities/HEmployeePosition`);

    return data;
  } catch (error) {
    return error;
  }
}

export async function deleteDepartment(id) {
  try {
    const data = await $axios.delete(`/rest/entities/EBkutOrganizations/${id}`);
    return getDeleteResponse(data);
  } catch (error) {
    return false;
  }
}
export async function sendDepartment(_data) {
  try {
    const { director, ...data } = _data;
    let resDirector = await getEmployee(director, true);
    console.log(resDirector);
    const { data: response } = await $axios.post(
      "/rest/entities/EBkutOrganizations",
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
    console.log(data.pinfl);
    if (data.pinfl) {
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
    }

    if (isPost) {
      const { position, bkutId, fio, ...req } = data;
      if (response1?.length > 0) {
        response1 = (Array.isArray(response1) ? response1 : [{}])[0];
        req.id = response1.id;
      }
      response1 = (
        await $axios.post("/rest/entities/HIndividual", req, {
          headers: { "Content-Type": "application/json" },
        })
      ).data;
      // }
    } else {
      response1 = (Array.isArray(response1) ? response1 : [{}])[0];
    }

    return response1;
  } catch (error) {
    return error;
  }
}

export async function deleteEmployee(id) {
  try {
    const data = await $axios.delete(
      "/rest/entities/EOrganizationEmployees/" + id
    );
    console.log(data);
    return getDeleteResponse(data);
  } catch (error) {
    return false;
  }
}
export async function sendEmployee(_data, employees = []) {
  try {
    let result;
    let response1 = await getEmployee(_data, true);
    const {
      fio,
      firstName,
      bkutId,
      lastName,
      middleName,
      phon,
      email,
      position,
      pinfl,
      birthDate,
      isKasabaActive,
      isHomemaker,
      isMember,
      isInvalid,
      isPensioner,
      isStudent,
      ...data
    } = _data;
    console.log(data);
    const requestData = {
      id: bkutId,
      employees: [
        ...employees.map((e) => ({
          position: {
            id: e.position.id,
          },
          individual: {
            id: e.individual.id,
            phone: e.phoneNumber,
            email: e.email,
          },
          bkut: {
            id: bkutId,
          },
          memberJoinDate: e.memberJoinDate,
          isKasabaActive: e.isKasabaActive || false, // Example values, replace with your logic
          isHomemaker: e.isHomemaker || false,
          isMember: e.isMember || false,
          isInvalid: e.isInvalid || false,
          isPensioner: e.isPensioner || false, // Example value, replace with your logic
          isStudent: e.isStudent || false,
        })),
        {
          position: {
            id: position,
          },
          individual: {
            id: response1.id,
            phone: data.phone,
            email: email,
          },
          bkut: {
            id: bkutId,
          },
          memberJoinDate: data.memberJoinDate,
          isKasabaActive: isKasabaActive || false, // Example values, replace with your logic
          isHomemaker: isHomemaker || false,
          isMember: isMember || false,
          isInvalid: isInvalid || false,
          isPensioner: isPensioner || false, // Example value, replace with your logic
          isStudent: isStudent || false,
        },
      ],
    };
    result = await sendEBKUT(requestData);
    console.log(requestData);

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
    requestData.employees[0].individual.id = memberId;
    requestData.employees.unshift(...oldMembers);
    result = await sendEBKUT(requestData);

    return result;
  } catch (error) {
    return error;
  }
}
export async function deleteMember(id) {
  return await deleteEmployee(id);
}
export async function fetchMember(id) {
  try {
    const { data } = await $axios.get(
      "/rest/entities/EOrganizationEmployees/" + id
    );

    return data;
  } catch (error) {
    return error;
  }
}

// Function to send contracts
export async function sendContracts(data) {
  try {
    const response = await $axios.post(
      data?.collectiveAgreements?.statementNo
        ? "/rest/services/application/returnCollectiveAgreements"
        : "/rest/services/application/applyCollectiveAgreements",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
}
export async function sendStatistics(_data) {
  try {
    const { ...data } = _data;
    const { data: response } = await $axios.post(
      "/rest/entities/EReports",
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
