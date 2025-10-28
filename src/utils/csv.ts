import Papa from 'papaparse';
import { ExecutionResult } from '../types/props';
import { getMessage } from '../messages/message';

export const getCsvData = async (file: File): Promise<ExecutionResult> => {
  if (!isCsvFile(file.name)) {
    return { data: [], error: getMessage.dataType };
  }
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({ data: results.data, error: ''});
      },
      error: (e) => {
        reject({ data: [], error: e });
      }
    });
  });
};

export const isCsvFile = (fileName: string): boolean => {
  return fileName.endsWith('.csv');
}
