// modules/user/userApi.ts
import { api } from "@/core/api/apiHandler";

export const getUsers = async () => {
  return api.get("/users");
};

export const getUserById = async (id: string) => {
  return api.get(`/users/${id}`);
};
