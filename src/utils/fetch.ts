import { getEstatData } from '../api/fetch';
import { ExecutionResult } from '../types/props';
import { getMessage } from '../messages/message';

export const getFetchData = async (): Promise<ExecutionResult> => {
  try {
    const response = await getEstatData();
    const status = response?.GET_STATS_DATA.RESULT.STATUS;
    if (status !== 0) {
      const error = response?.GET_STATS_DATA.RESULT.ERROR_MSG;
      return { data: [], error: error };
    }
    const classes = response?.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ;
    const datas = response?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;

    const areaObj = classes?.find((item: any) => item['@id'] === 'area');
    if (!areaObj || !areaObj.CLASS) return { data: [], error: getMessage.getDatafailed };
    const prefList = areaObj.CLASS.map((item: any) => ({
      code: item['@code'],
      name: item['@name'],
    }));

    const years = [...new Set(datas?.map((item: any) => item['@time']))];
    const rows = years.map((year: any) => {
      const yearRecord = datas?.filter((item: any) => item['@time'] === year);
      const row: any = {year: year.slice(0, 4)};
      prefList.map((pref: any) => {
        const record = yearRecord?.find((item: any) => item['@area'] === pref.code);
        return row[pref.name] = record ? Number(record['$']).toLocaleString() : '-';
      });
      return row;
    });
    const reversedRows = rows.reverse(); 
    return { data: reversedRows, error: '' };

  } catch (e) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}
