import { $axios, getDeleteResponse } from ".";

export async function searchEmployee(data, isPost) {
  try {
    let response1;

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
    return getDeleteResponse(data);
  } catch (error) {
    return false;
  }
}
export async function sendIndividual(requestData) {
  try {
    const { data } = requestData.id
      ? await $axios.put(
          "/rest/entities/HIndividual/" + requestData.id,
          requestData,
          { headers: { "Content-Type": "application/json" } }
        )
      : await $axios.post("/rest/entities/HIndividual/", requestData, {
          headers: { "Content-Type": "application/json" },
        });
    data.success = !!data?.id;

    return data;
  } catch (error) {
    return error;
  }
}
export async function sendEmployee(requestData = {}) {
  try {
    const individualResponse = await sendIndividual(requestData.individual);
    // requestData.individual = { id: individualResponse.id };
    const { data } = requestData.id
      ? await $axios.put(
          "/rest/entities/EOrganizationEmployees/" + requestData.id,
          requestData,
          { headers: { "Content-Type": "application/json" } }
        )
      : await $axios.post(
          "/rest/entities/EOrganizationEmployees/",
          requestData,
          { headers: { "Content-Type": "application/json" } }
        );
    data.success = !!data?.id;

    return data;
  } catch (error) {
    return error;
  }
}

export async function getEmployee(id) {
  try {
    const { data } = await $axios.get(
      "/rest/entities/EOrganizationEmployees/" + id
    );

    return data;
  } catch (error) {
    return error;
  }
}

export async function generateTicketMember(bkutId, memberId) {
  try {
    const { data } = await $axios.post(
      "/rest/services/application/generateTicket",
      {
        bkut: {
          id: bkutId,
        },
        member: {
          id: memberId,
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

export async function getTicketMember(code) {
  try {
    const { data } = await $axios.post(
      "/rest/services/application/getTicket",
      {
        code,
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
