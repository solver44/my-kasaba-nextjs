import { $axios } from ".";

export async function readAllNotifications(bkutId) {
  try {
    const { data } = await $axios.post(
      "/rest/services/bkut/readAllNotifications",
      {
        bkut: {
          id: bkutId,
        },
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

export async function getNotifications(bkutId) {
  try {
    const { data } = await $axios.post(
      "/rest/services/bkut/notifications",
      {
        bkut: {
          id: bkutId,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error) {
    return error?.response?.data;
  }
}
