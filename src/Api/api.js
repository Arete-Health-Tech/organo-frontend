import axios from "axios";

//// const baseUrl = 'http://localhost:3009/api/backend/endpoint/'
const baseUrl = "https://organo.aretehealth.tech/api/backend/endpoint/";

// Define the async function that fetches the data
const fetchOrganoApi = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}getAuditComments`, payload);
    return response.data; // or return the full response if needed
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Optionally handle the error
  }
};

export const searchOrganoApi = async (searchEmployeeId) => {
  try {
    const response = await axios.post(`${baseUrl}/search`, {
      employeeId: searchEmployeeId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Export the async function for use in other parts of your app
export default fetchOrganoApi;
// const OrganoApi = await axios.post(`${baseUrl}/getAuditComments`, { "location": "Gurgaon" });
// export default OrganoApi
