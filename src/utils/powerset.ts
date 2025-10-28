import { getMessage } from '../messages/message';

export const getPowerset = <T>(arr: T[]): T[][] => {	
  try {
    const powerset = (arr: any) => arr.reduce((acc: any, val:any) => acc.concat(acc.map((res: any) => [val].concat(res))), [[]]);
    return powerset(arr);
  } catch (e) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}  
