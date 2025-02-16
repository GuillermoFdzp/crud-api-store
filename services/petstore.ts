import axios from 'axios';

const API_BASE_URL = 'https://petstore.swagger.io/v2';
const API_KEY = 'special-key'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api_key': API_KEY, 
  },
});

export const getPetById = async (petId: number) => {
  const response = await axiosInstance.get(`/pet/${petId}`);
  return response.data;
};

export const addPet = async (pet: any) => {
  const response = await axiosInstance.post('/pet', pet);
  return response.data;
};

export const updatePet = async (pet: any) => {
  const response = await axiosInstance.put('/pet', pet);
  return response.data;
};

export const deletePet = async (petId: number) => {
  const response = await axiosInstance.delete(`/pet/${petId}`);
  return response.data;
};

export const findPetsByStatus = async (status: string[]) => {
  const response = await axiosInstance.get('/pet/findByStatus', {
    params: { status: status.join(',') },
  });
  return response.data;
};
