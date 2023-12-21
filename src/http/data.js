import { saveAs } from "file-saver";
import { $axios, BASE_URL, getDeleteResponse } from ".";

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

export async function downloadFile(file, name, onlyReturn) {
  try {
    const url = `/rest/files?fileRef=${encodeURIComponent(
      file
    )}&attachment=false`;
    const response = await $axios.get(url, { responseType: "arraybuffer" });
    const blob = new Blob([response.data], {
      type: response.headers["Content-Type"],
    });
    if (onlyReturn) return blob;
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
      responseType: "arraybuffer",
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
    let resDirector = await searchEmployee(director, true);
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

export async function sendCollectiveReport(data) {
  try {
    const { data: response } = await $axios.post(
      "/rest/services/application/sendCollectiveAgrReport",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function sendContracts(data, isReturn) {
  try {
    const response = await $axios.post(
      isReturn
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
