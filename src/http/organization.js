import { $axios } from ".";

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
