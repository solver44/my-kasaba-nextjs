import { getIsOrganization } from "@/utils/data";
import { $axios } from ".";

export async function getReport1ti(id, date) {
  try {
    const isOrg = getIsOrganization();
    const { data } = await $axios.post(
      "/rest/services/bkut/report1ti",
      {
        id,
        date,
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
