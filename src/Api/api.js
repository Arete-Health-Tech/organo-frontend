import axios from "axios";

const baseUrl = 'http://localhost:3009/api/backend/endpoint'

// Define the async function that fetches the data
const fetchOrganoApi = async () => {
    try {
        const response = await axios.post(`${baseUrl}/getAuditComments`, { location: "Gurgaon" });
        return response.data;  // or return the full response if needed
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;  // Optionally handle the error
    }
};

// Export the async function for use in other parts of your app
export default fetchOrganoApi;
// const OrganoApi = await axios.post(`${baseUrl}/getAuditComments`, { "location": "Gurgaon" });
// export default OrganoApi