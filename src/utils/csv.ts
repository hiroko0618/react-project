import Papa from 'papaparse';

export const getCsvData = async (file: File): Promise<any[]> => {
  if (!isCsvFile(file.name)) {
    console.error('CSV形式のファイルを選択してください。');
  }
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: () => {
        reject(new Error('csv parse error'));
      }
    });
  });
};

export const isCsvFile = (fileName: string): boolean => {
  return fileName.endsWith('.csv');
}
