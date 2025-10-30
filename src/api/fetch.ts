import { EStatResponseType } from '../types/estatParams';
import { getMessage } from '../messages/message';

export const getEstatData = async (): Promise<EStatResponseType> => {

  const baseUrl = 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData';
  const appId = process.env.REACT_APP_ESTAT_API_APPID!;
  const parameter = process.env.REACT_APP_ESTAT_API_PARAMETER!;
  const url = `${baseUrl}?appId=${appId}&${parameter}`;
  const proxyUrl = `https://corsproxy.io/?${url}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`${getMessage.getDatafailed}, ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (!isValidEstatResponse(json)) {
      throw new Error(getMessage.getDatafailed);
    }

    return json as EStatResponseType;
  } catch (e: any) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}

const isValidEstatResponse = (data: any): boolean => {
  return data && typeof data === 'object' && 'GET_STATS_DATA' in data;
}
