import { EStatResponseType } from '../types/estatParams';
import { getMessage } from '../messages/message';

export async function getEstatData(): Promise<EStatResponseType> {
  const baseUrl = 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData';
  const parameter = 'cdArea=08000%2C09000%2C10000%2C11000%2C12000%2C13000%2C14000%2C19000&cdCat01=A1101&lang=J&statsDataId=0000010101&metaGetFlg=Y&cntGetFlg=N&explanationGetFlg=Y&annotationGetFlg=Y&sectionHeaderFlg=1&replaceSpChars=0';
  const appId = process.env.REACT_APP_ESTAT_API_APPID;
  const url = `${baseUrl}?appId=${appId}&${parameter}`;
  const proxyUrl = `https://corsproxy.io/?${url}`;

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    
    return json as EStatResponseType;
  } catch (e: any) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}
