import { submitLayerImprovmentFormAPI } from "@/apis";

export const pushLayerImprovement = async (data: unknown) => {
  const res = await submitLayerImprovmentFormAPI(data);
  return res;
};
