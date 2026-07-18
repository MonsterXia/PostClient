import { getLayerImprovmentFormAPI, serverAdminLoginAPI, serverAdminRegisterAPI, serverAdminRegisterValidationAPI, usernameCheckAPI } from "@/apis";

export const fetchLayerImprovmentForm = async () => {
  const res = await getLayerImprovmentFormAPI();
  return res;
};

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
