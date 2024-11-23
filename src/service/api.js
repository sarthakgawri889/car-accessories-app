import axios from "axios";

const url = 'http://localhost:5000'

export const addUser = async (data) => {
    try {
      await axios.post(`${url}/add`, data);
    } catch (error) {
      console.log("error while addUser API", error.message);
    }
  };

  export const getUsers = async () => {
    try {
      let response = await axios.get(`${url}/users`);
      return response.data;
    } catch (error) {
      console.log("error while calling getUsers api", error.message);
    }
  };

