import { submitLayerImprovmentFormAPI } from "@/apis";

export const pushLayerImprovement = async (data: any) => {
  const res = await submitLayerImprovmentFormAPI(data);
  return res;
};