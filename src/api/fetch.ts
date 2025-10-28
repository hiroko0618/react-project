import { EStatResponseType } from '../types/estatParams';
import { getMessage } from '../messages/message';

export async function getEstatData(): Promise<EStatResponseType> {
  const url = 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?cdArea=08000%2C09000%2C10000%2C11000%2C12000%2C13000%2C14000%2C19000&cdCat01=A1101&appId=320af32df84e35bbbc05e7c3a44d107a1ce4c82e&lang=J&statsDataId=0000010101&metaGetFlg=Y&cntGetFlg=N&explanationGetFlg=Y&annotationGetFlg=Y&sectionHeaderFlg=1&replaceSpChars=0';
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
