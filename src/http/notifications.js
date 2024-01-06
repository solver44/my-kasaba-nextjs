import { getIsOrganization } from "@/utils/data";
import { $axios } from ".";

export async function readAllNotifications(id) {
  try {
    const isOrg = getIsOrganization();
    const { data } = await $axios.post(
      "/rest/services/bkut/readAllNotifications",
      {
        id,
        type: isOrg ? "organization" : "bkut",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getNotifications(id) {
  try {
    const isOrg = getIsOrganization();
    const { data } = await $axios.post(
      "/rest/services/bkut/notifications",
      {
        id,
        type: isOrg ? "organization" : "bkut",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error) {
    return error?.response?.data;
  }
}
