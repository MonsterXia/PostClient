import { getLayerImprovmentFormAPI } from "@/apis";

export const fetchLayerImprovmentForm = async () => {
  const res = await getLayerImprovmentFormAPI();
  return res;
};