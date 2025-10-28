export interface Messages {
  required: string;
  dataType: string;
  getDatafailed: string;
  showDetail: string;
}

export const getMessage:Messages = {
  required: 'ファイルが選択されていません',
  dataType: 'CSV形式のファイルを選択してください',
  getDatafailed: 'データの取得に失敗しました',
  showDetail: 'エラー詳細',
} 
