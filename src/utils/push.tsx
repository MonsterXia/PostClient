import { submitBattleGroupScoreAPI, submitLayerAcceptanceAPI } from "@/apis";

export const pushBattleGroupScore = async (data: any) => {
  const res = await submitBattleGroupScoreAPI(data);
  return res;
};

export const pushLayerAcceptance = async (data: any) => {
  const res = await submitLayerAcceptanceAPI(data);
  return res;
};