import { getCsvData } from './csv';
import { getPowerset } from './powerset';

export const getFriendshipScores = (subjects: string[], relation: any[], currentScore: number): any => {
  try {
    if (subjects.length <= 1) return;
 
    const firstEl = subjects[0]; 
    const remainingEl = subjects.slice(1);
    const size = subjects.length;
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
    console.error('エラー詳細', e);
    throw e;
  }
}

export const getFriendshipDatas = async (event: any): Promise<any[]> => {
  try {
    const target = event?.target.files[0] as File;
    const friendshipDatas = await getCsvData(target);
    if (!friendshipDatas) return [];

    const prefectures = Object.keys(friendshipDatas[0]).filter((key: any) => key !== 'x');
    if (!prefectures) return [];

    const groups = calcFriendshipLevel(prefectures, friendshipDatas, 0, 0);
    return groups;
  } catch (e) {
    console.error('エラー詳細', e);
    throw e;
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
    console.error('エラー詳細', e);
    throw e;
  }
}
