import axios from "./axios.customize";
const createUser = async (
  email,
  password,
  role,
  fullName,
  gender,
  address,
  phoneNumber,
  dateOfBirth,
  studentClass,
  description,
  MSV
) => {
  const URL = `/users/create`;
  const data = {
    email,
    password,
    role,
    fullName,
    gender,
    address,
    phoneNumber,
    dateOfBirth,
    studentClass,
    description,
    MSV,
  };

  const response = await axios.post(URL, data);
  return response.data;
};

const loginApi = (email, password) => {
  const URL = `/users/login`;
  const data = {
    email,
    password,
  };
  return axios.post(URL, data);
};
const getAllUser = async () => {
  const URL = `/users/all`;
  return axios.get(URL);
};
const updateUser = async (_id, updatedUserData) => {
  const response = await axios.put(`/users/admin/${_id}`, updatedUserData);

  if (response.data) {
    return response.data;
  }
};

const updateUserStatus = async (_id, updatedData) => {
  const URL = `/users/status/${_id}`;
  const response = await axios.put(URL, updatedData);

  return response;
};
const deleteUser = async (_id) => {
  const response = await axios.delete(`/users/${_id}`);
  if (response.success) {
    return "ok";
  }
};

export {
  createUser,
  loginApi,
  getAllUser,
  updateUser,
  deleteUser,
  updateUserStatus,
};
