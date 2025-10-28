import { getCsvData } from './csv';
import { getPowerset } from './powerset';
import { ExecutionResult } from '../types/props';
import { getMessage } from '../messages/message';

export const getFriendshipScores = (subjects: string[], relation: any[], currentScore: number): any => {
  try {
    if (subjects.length <= 1) return;
 
    const firstEl = subjects[0]; 
    const remainingEl = subjects.slice(1);
    let score = 0;
    
    for(let i = 0; i < subjects.length -1; i++) {
      const secondEl = subjects[i + 1];
      const result = relation.find((item: any) => {
        return (
          (item.a === firstEl && item.b === secondEl) ||
          (item.b === firstEl && item.a === secondEl)
        )
      });
      score += result.score;
    }
    getFriendshipScores(remainingEl, relation, score);
  
    return 0;
  } catch(e) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}

export const getFriendshipDatas = async (event: any): Promise<ExecutionResult> => {
  try {
    const target = event?.target.files[0] as File;
    if (!target || target === null) {
      return { data: [], error: getMessage.required }
    }
    
    const friendshipDatas = await getCsvData(target);
    if (!friendshipDatas || friendshipDatas.data === null || friendshipDatas.data.length === 0) { 
      return { data: [], error: friendshipDatas.error }; 
    };

    const prefectures = Object.keys(friendshipDatas.data[0]).filter((key: any) => key !== 'x');
    const groups = calcFriendshipLevel(prefectures, friendshipDatas.data, 0, 0);
    return { data:groups, error: '' };
  } catch (e) {
    console.error(getMessage.showDetail, e);
    return { data: [], error: getMessage.getDatafailed }
  }
}

const calcFriendshipLevel = (prefectures: string[], friendshipDatas: any[], count: number, currentScore: number):any[] => {
  const groups: any[] = [];
  try {
    if (prefectures.length === 0) return groups;

    const subset = getPowerset(prefectures).filter((item: any) => item.length > 1).sort();
    const friendship: any[] = [];
    friendshipDatas.forEach((data) => {
      const from = data.x;
      Object.entries(data).forEach(([to, value]) => {
	if (to !== 'x' && value !== '-') {
          friendship.push({a: from, b: to, score: Number(value)})
	}
      });
    });
    const scoreList: number[] = subset.map((data: any) => { 
      return getFriendshipScores(data, friendship, currentScore);
    });
    const maxScore = Math.max(...scoreList);
    const maxIndex = scoreList.indexOf(maxScore);
    const bestGroup = subset[maxIndex];

    groups.push(bestGroup);
    
    const newPrefectures = prefectures.filter((item: any) => !bestGroup.includes(item));
    const nextGroups = calcFriendshipLevel(newPrefectures, friendshipDatas, count + 1, currentScore);
    return groups.concat(nextGroups);
  } catch (e) {
    console.error(getMessage.showDetail, e);
    throw e;
  }
}
