import { fetchLayerImprovmentForm } from "@/utils";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Skeleton, Card, Button, Form, InputNumber, message } from "antd";
import { useSelector } from "react-redux";
import "./LayerImprovment.css";
import { pushLayerImprovement } from "@/utils/push";
import { useNavigate } from "react-router-dom";
const LayerImprovment: React.FC = () => {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const { messages, locale } = useSelector((state: any) => state.language);
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const naviagte = useNavigate();

    useEffect(() => {
        const jsonData = fetchLayerImprovmentForm();
        jsonData.then((res) => {
            if (res.status === 200) {
                setData(res.data.message)
                setLoading(false);
                console.log(res.data.message);
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: messages.failed2catchData,
            });
            console.error("Error fetching data:", error);
        })
    }, []);

    const formPart1: { country: string, battleGroup: string }[] = data?.formPart1;
    const formPart2: string[] = data?.formPart2;
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setIsSubmitting(true);
        messageApi.open({
            type: 'warning',
            content: messages.submitting,
        });

        const formPart1Values: { country: string, battle_group: string, score: number }[] = formPart1.map((item, index) => {
            return {
                "country": item.country,
                "battle_group": item.battleGroup,
                "score": values["battleGroup_" + index] === undefined ? 50 : values["battleGroup_" + index],
            };
        });

        const formPart2Values: { layer: string, score: number }[] = formPart2.map((item, index) => {
            return {
                layer: item,
                score: values["layer" + index] === undefined ? 50 : values["layer" + index],
            };
        });

        const data2Push = {
            "battle_group_score": formPart1Values,
            "battle_group_layer_score": formPart2Values,
        }

        const result = await pushLayerImprovement(data2Push);

        if (result.status === 201) {
            console.log("Push success");
            naviagte("/questionares/complete");
        } else {
            messageApi.open({
                type: 'error',
                content: messages.failed2submitData,
            });
            setIsSubmitting(false);
            console.log("Push failed");
        }
    };

    const conutryConvert = (country: string) => {
        switch (country) {
            case "ADF":
                return messages.questionare_layerImprovement_country_ADF;
            case "BAF":
                return messages.questionare_layerImprovement_country_BAF;
            case "CAF":
                return messages.questionare_layerImprovement_country_CAF;
            case "USA":
                return messages.questionare_layerImprovement_country_USA;
            case "USMC":
                return messages.questionare_layerImprovement_country_USMC;
            case "IMF":
                return messages.questionare_layerImprovement_country_IMF;
            case "INS":
                return messages.questionare_layerImprovement_country_INS;
            case "MEA":
                return messages.questionare_layerImprovement_country_MEA;
            case "TLF":
                return messages.questionare_layerImprovement_country_TLF;
            case "WPMC":
                return messages.questionare_layerImprovement_country_WPMC;
            case "PLA":
                return messages.questionare_layerImprovement_country_PLA;
            case "PLAAGF":
                return messages.questionare_layerImprovement_country_PLAAGF;
            case "PLANMC":
                return messages.questionare_layerImprovement_country_PLANMC;
            case "RGF":
                return messages.questionare_layerImprovement_country_RGF;
            case "VDV":
                return messages.questionare_layerImprovement_country_VDV;
            default:
                return country;
        }
    }

    const battleGroupConvert = (battleGroup: string) => {
        switch (battleGroup) {
            case "AirAssault":
                return messages.questionare_layerImprovement_battleGroup_AirAssault;
            case "Armored":
                return messages.questionare_layerImprovement_battleGroup_Armored;
            case "CombinedArms":
                return messages.questionare_layerImprovement_battleGroup_CombinedArms;
            case "LightInfantry":
                return messages.questionare_layerImprovement_battleGroup_LightInfantry;
            case "Mechanized":
                return messages.questionare_layerImprovement_battleGroup_Mechanized;
            case "Motorized":
                return messages.questionare_layerImprovement_battleGroup_Motorized;
            case "Support":
                return messages.questionare_layerImprovement_battleGroup_Support;
            case "AmphibiousAssault":
                return messages.questionare_layerImprovement_battleGroup_AmphibiousAssault;
            default:
                return battleGroup;
        }
    }

    const levelConvert = (level: string) => {
        switch (level) {
            case "AlBasrah":
                return messages.questionare_layerImprovement_level_AlBasrah;
            case "Anvil":
                return messages.questionare_layerImprovement_level_Anvil;
            case "Belaya":
                return messages.questionare_layerImprovement_level_BelayaPass;
            case "BlackCoast":
                return messages.questionare_layerImprovement_level_BlackCoast;
            case "Chora":
                return messages.questionare_layerImprovement_level_Chora;
            case "Fallujah":
                return messages.questionare_layerImprovement_level_Fallujah;
            case "FoolsRoad":
                return messages.questionare_layerImprovement_level_FoolsRoad;
            case "GooseBay":
                return messages.questionare_layerImprovement_level_GooseBay;
            case "Gorodok":
                return messages.questionare_layerImprovement_level_Gorodok;
            case "Harju":
                return messages.questionare_layerImprovement_level_Harju;
            case "JensensRange":
                return messages.questionare_layerImprovement_level_JensensRange;
            case "Kamdesh":
                return messages.questionare_layerImprovement_level_KamdeshHighlands;
            case "Kohat":
                return messages.questionare_layerImprovement_level_KohatToi;
            case "Kokan":
                return messages.questionare_layerImprovement_level_Kokan;
            case "Lashkar":
                return messages.questionare_layerImprovement_level_LashkarValley;
            case "Logar":
                return messages.questionare_layerImprovement_level_LogarValley;
            case "Manicouagan":
                return messages.questionare_layerImprovement_level_Manicouagan;
            case "Mestia":
                return messages.questionare_layerImprovement_level_Mestia;
            case "Mutaha":
                return messages.questionare_layerImprovement_level_Mutaha;
            case "Narva":
                return messages.questionare_layerImprovement_level_Narva;
            case "PacificProvingGrounds":
                return messages.questionare_layerImprovement_level_PacificProvingGrounds;
            case "Sanxian":
                return messages.questionare_layerImprovement_level_Sanxian;
            case "Skorpo":
                return messages.questionare_layerImprovement_level_Skorpo;
            case "Sumari":
                return messages.questionare_layerImprovement_level_SumariBala;
            case "Tallil":
                return messages.questionare_layerImprovement_level_TallilOutskirts;
            case "Yehorivka":
                return messages.questionare_layerImprovement_level_Yehorivka;
            default:
                return level;
        }
    }

    const modeConvert = (mode: string) => {
        switch (mode) {
            case "AAS":
                return messages.questionare_layerImprovement_mode_AAS;
            case "RAAS":
                return messages.questionare_layerImprovement_mode_RAAS;
            case "Skirmish":
                return messages.questionare_layerImprovement_mode_Skirmish;
            case "Invasion":
                return messages.questionare_layerImprovement_mode_Invasion;
            case "Destruction":
                return messages.questionare_layerImprovement_mode_Destruction;
            case "Insurgency":
                return messages.questionare_layerImprovement_mode_Insurgency;
            case "TC":
                return messages.questionare_layerImprovement_mode_TerritoryControl;
            case "Seed":
                return messages.questionare_layerImprovement_mode_Seed;
            default:
                return mode;
        }
    }

    const layerConvert = (layer: string) => {
        const textSlice = layer.split(" ");
        const layerSlice: string[] = textSlice[0].split("_");
        const layerName = messages.level + ": " + levelConvert(layerSlice[0]) + " " + messages.mode + ": " + modeConvert(layerSlice[1]) + " " + messages.version_text + ": " + layerSlice[2] + " ";

        const team1 = textSlice[1].split("+");
        const team1Name = messages.faction + "1: " + conutryConvert(team1[0]) + " " + messages.battleGroup + "1: " + battleGroupConvert(team1[1]) + " ";
        const team2 = textSlice[2].split("+");
        const team2Name = messages.faction + "2: " + conutryConvert(team2[0]) + " " + messages.battleGroup + "2: " + battleGroupConvert(team2[1]) + " ";

        return layerName + team1Name + team2Name;
    }

    return (
        <ConfigProvider
            locale={locale}
        >
            {contextHolder}
            <Skeleton loading={loading} active>
                <Card title={messages.questionare_layerImprovement_title} className="questionare-layer-improvment-card">
                    <Form
                        layout="vertical"
                        form={form}
                        name="questionare-layer-improvment-form"
                        onFinish={onFinish}
                    >
                        <Card
                            type="inner"
                            title={messages.questionare_layerImprovement_subtitle1}
                            className="questionare-layer-improvment-card-inner"
                        >
                            {messages.questionare_layerImprovement_description1}<br /><br />
                            {formPart1 !== undefined && formPart1.map((item, index) => (
                                <Form.Item
                                    key={"questionare_layerImprovement_formPart1_" + index}
                                    name={"battleGroup_" + index}
                                    label={conutryConvert(item.country) + messages.primeS + " " + battleGroupConvert(item.battleGroup)}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </Form.Item>
                            ))}
                        </Card>
                        <Card
                            className={`questionare-layer-improvment-card-inner-second questionare-layer-improvment-card-inner`}
                            type="inner"
                            title={messages.questionare_layerImprovement_subtitle2}
                        >
                            {messages.questionare_layerImprovement_description2}<br /><br />
                            {formPart2 !== undefined && formPart2.map((item, index) => (
                                <Form.Item
                                    key={"questionare_layerImprovement_formPart2_" + index}
                                    name={"layer" + index}
                                    label={layerConvert(item)}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </Form.Item>
                            ))}
                        </Card>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                                {messages.submit}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Skeleton>
        </ConfigProvider>
    )
}

export default LayerImprovment;