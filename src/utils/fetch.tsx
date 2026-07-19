import { serverAdminLoginAPI, serverAdminRegisterAPI, serverAdminRegisterValidationAPI, usernameCheckAPI, serverAdminLogoutAPI, getCurrentAdminAPI, adminBindingAPI, adminUnbindingAPI } from "@/apis";

export const fetchAdminEmailCheck = async (data: unknown) => {
  const res = await usernameCheckAPI(data);
  return res;
}

export const fetchServerAdminRegister = async (data: unknown) => {
  const res = await serverAdminRegisterAPI(data);
  return res;
};

export const fetchServerAdminRegisterValidation = async (data: unknown) => {
  const res = await serverAdminRegisterValidationAPI(data);
  return res;
};

export const fetchServerAdminLogin = async (data: unknown) => {
  const res = await serverAdminLoginAPI(data);
  return res;
};

export const fetchServerAdminLogout = async () => {
  const res = await serverAdminLogoutAPI();
  return res;
};

export const fetchGetCurrentAdmin = async () => {
  const res = await getCurrentAdminAPI();
  return res;
};

export const fetchAdminBinding = async (data: unknown) => {
  const res = await adminBindingAPI(data);
  return res;
};

export const fetchAdminUnbinding = async () => {
  const res = await adminUnbindingAPI();
  return res;
};
