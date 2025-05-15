import { getLayerImprovmentFormAPI, serverAdminRegisterAPI, serverAdminRegisterValidationAPI, usernameCheckAPI } from "@/apis";

export const fetchLayerImprovmentForm = async () => {
  const res = await getLayerImprovmentFormAPI();
  return res;
};

export const fetchAdminEmailCheck = async (data: any) => {
  const res = await usernameCheckAPI(data);
  return res;
}

export const fetchServerAdminRegister = async (data: any) => {
  const res = await serverAdminRegisterAPI(data);
  return res;
};

export const fetchServerAdminRegisterValidation = async (data: any) => {
  const res = await serverAdminRegisterValidationAPI(data);
  return res;
};