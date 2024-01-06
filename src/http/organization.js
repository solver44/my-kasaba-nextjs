import { $axios } from ".";
import qs from "qs";

export async function getOrganizations(bkutId) {
  try {
    const { data } = await $axios.post(
      `/rest/entities/EBkutOrganizations/search`,
      {
        fetchPlan: "all-organization",
        filter: {
          conditions: [
            {
              property: "bkut.id",
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

export async function getUserOrganization(organizationId) {
  try {
    const { data } = await $axios.post(
      "/rest/services/organization/getUser",
      {
        organization: {
          id: organizationId,
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
