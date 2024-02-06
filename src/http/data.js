import { saveAs } from "file-saver";
import { $axios, BASE_URL, getDeleteResponse } from ".";
import { getIsOrganization } from "@/utils/data";
import { sendEmployee, sendIndividual } from "./employees";

export async function loginRest(email, password) {
  try {
    const { data } = await $axios.post(
      "/rest/services/application/login",
      {
        email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
}
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
export async function getBKUTData(id, isOrg, bkutData) {
  try {
    const bkutId = id ?? localStorage.getItem("token");
    if (bkutData?.id === id) return bkutData;
    const { data } = await $axios.get(
      isOrg
        ? `/rest/entities/EBkutOrganizations/${bkutId}`
        : `/rest/entities/EBKUT/${bkutId}`,
      {
        params: { fetchPlan: isOrg ? "all-organization" : "bkut-cabinet" },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
}

export async function downloadFile(file, name, onlyReturn, base64) {
  try {
    const url = `/rest/files?fileRef=${encodeURIComponent(
      file
    )}&attachment=false`;
    const response = await $axios.get(url, { responseType: "arraybuffer" });
    if (onlyReturn && base64)
      return Buffer.from(response.data, "binary").toString("base64");

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
export async function sendDepartment(data) {
  try {
    // const { employees, ...data } = _data;
    const { data: response } = data?.id
      ? await $axios.put("/rest/entities/EBkutOrganizations/" + data.id, data, {
          headers: { "Content-Type": "application/json" },
        })
      : await $axios.post("/rest/entities/EBkutOrganizations", data, {
          headers: { "Content-Type": "application/json" },
        });
    const id = response?.id;
    // if (id && employees?.length) {
    //   await sendEmployee({ ...employees[0], eBkutOrganization: { id } });
    // }

    return id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}
export async function sendEBKUT(data) {
  try {
    const { data: response } = await $axios.post(
      getIsOrganization()
        ? "/rest/entities/EBkutOrganizations"
        : "/rest/entities/EBKUT",
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
export async function sendStatistics(_data = {}) {
  try {
    const { id, ...data } = _data;
    const { data: response } = id
      ? await $axios.put("/rest/entities/EReports/" + id, data, {
          headers: { "Content-Type": "application/json" },
        })
      : await $axios.post("/rest/entities/EReports", data, {
          headers: { "Content-Type": "application/json" },
        });
    return response?.id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}

export async function sendELaborProtection(_data = {}) {
  try {
    const { id, ...data } = _data;
    const { data: response } = id
      ? await $axios.put("/rest/entities/ELaborProtection/" + id, data, {
          headers: { "Content-Type": "application/json" },
        })
      : await $axios.post("/rest/entities/ELaborProtection", data, {
          headers: { "Content-Type": "application/json" },
        });
    return response?.id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}

export async function getLaborProtections(bkutId) {
  try {
    const { data } = await $axios.post(
      `/rest/entities/ELaborProtection/search`,
      {
        fetchPlan: "eLaborProtection-fetch-plan",
        filter: {
          conditions: [
            {
              property: "eBKUT.id",
              operator: "=",
              value: bkutId,
            },
          ],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function getEntityOfBKUT(name, bkutId, fetchPlan) {
  try {
    const { data } = await $axios.post(
      `/rest/entities/${name}/search`,
      {
        fetchPlan,
        filter: {
          conditions: [
            {
              property: "eBKUT.id",
              operator: "=",
              value: bkutId,
            },
          ],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return error;
  }
}
export async function deleteEntityRow(name, id) {
  try {
    const data = await $axios.delete(`/rest/entities/${name}/${id}`);
    return getDeleteResponse(data);
  } catch (error) {
    return false;
  }
}
export async function sendBasicTools(_data = {}, name) {
  try {
    const { id, ...data } = _data;
    const { data: response } = id
      ? await $axios.put(`/rest/entities/${name}/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        })
      : await $axios.post("/rest/entities/" + name, data, {
          headers: { "Content-Type": "application/json" },
        });
    return response?.id
      ? { ...response, success: true }
      : { ...response, success: false };
  } catch (error) {
    return error;
  }
}
