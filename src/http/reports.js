import { $axios } from ".";

export async function getReport1ti(bkutId, date) {
  try {
    const { data } = await $axios.post(
      "/rest/services/bkut/report1ti",
      {
        bkut: {
          id: bkutId,
        },
        date,
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
