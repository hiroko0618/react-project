import { getEstatData } from '../api/fetch';

export const getFetchData = async (): Promise<any[]> => {
  try {
    const response = await getEstatData();
    const classes = response?.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ;
    const datas = response?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;

    const areaObj = classes?.find((item: any) => item['@id'] === 'area');
    if (!areaObj || !areaObj.CLASS) return [];
    const prefList = areaObj.CLASS.map((item: any) => ({
      code: item['@code'],
      name: item['@name'],
    }));

    const years = [...new Set(datas?.map((item: any) => item['@time']))];
    const rows = years.map((year: any) => {
      const yearRecord = datas.filter((item: any) => item['@time'] === year);
      const row: any = {year: year.slice(0, 4)};
      prefList.map((pref: any) => {
        const record = yearRecord.find((item: any) => item['@area'] === pref.code);
        return row[pref.name] = record ? Number(record['$']).toLocaleString() : '-';
      });
      return row;
    });
    return rows.reverse();

  } catch (e) {
    console.error('エラー詳細', e);
    throw e;
  }
}
