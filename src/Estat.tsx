import React, {useState, useEffect } from 'react';
import './styles/layout.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { getFetchData } from './utils/fetch';
import { getFriendshipDatas } from './utils/friendship';
import { getMessage } from './messages/message';

interface PopulationRow {
  year: string;
  [pref: string]: string;
}

const Estat = () => {
  const [tableData, setTableData] = useState<PopulationRow[]>([]);
  const [prefList, setPrefList] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState<string>('');
  
  useEffect (() => {
    (async () => {
      try {
        const result = await getFetchData();
        if (result.error !== '') {
          setTableData([]);
          setErrMsg(result.error);
        } else {
          setTableData(result.data);
          setErrMsg('');
        }
        const keys = Object.keys(result.data[0]).filter((key) => key !== 'year');
        setPrefList(keys);
      } catch (e) {
        if (e instanceof Error) {
          setErrMsg(e.message);
        } else {
          setErrMsg(getMessage.getDatafailed);
        }
      }
    })();
  }, []);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = await getFriendshipDatas(event);
    if (result.error !== '') {
      setGroups([]);
      setErrMsg(result.error); 
    } else {
      setGroups(result.data);
      setErrMsg('');
    }
  };
  
  const getCellColor = (pref: string) => {
    if (!groups) return;
    const index = groups.findIndex((group:any) => group.includes(pref));
    
    const colors = ['#FF0000', '#FFF000', '#0000FF'];
    return index >= 0 ? colors[index % colors.length] : '#fff';
  };

  return (
  <div className='field'>
    <div>
      <Table responsive bordered hover>
        <thead>
          <tr>
            <th></th>
            {prefList.map((pref) => (
              <th key={pref} style={{ backgroundColor: getCellColor(pref) }}>{pref}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, i) => (
            <tr key={i}>
              <td className='yearCell'>{item.year}年</td>
              {prefList.map((pref) => (
                <td key={pref}>
                  {`${item[pref]}人`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    <div className='right'>
      <p>友好度データを読み込む</p>
      <input type="file" accept="text/csv" onChange={handleFileChange} />
      {errMsg && (
        <div className='error'>
          {errMsg}
        </div>
      )}
    </div>
  </div>

  );
}

export default Estat;
