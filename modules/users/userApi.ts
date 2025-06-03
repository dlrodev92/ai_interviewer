// modules/user/userApi.ts
import { apiHandler } from '@/core/apiHandler';

export const getUsers = async () => {
  return apiHandler.get('/users');
};

export const getUserById = async (id: string) => {
  return apiHandler.get(`/users/${id}`);
};
