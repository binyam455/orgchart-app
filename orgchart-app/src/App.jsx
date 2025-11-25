
import React, { useState, useEffect } from 'react';
import RootContent from "./components/RootContent"
import OrgChartNode from './components/OrgChartNode'


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataArr, setDataArr] = useState([]);
  const [dataMap, setDataMap] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/orgchart/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);

      let tmpres = [...result];
      let dataMapObj = new Map();

      if (!tmpres.length) {
        const newArr = [ ];
        setDataArr(newArr);
        setDataMap(dataMapObj);
        return;
      }

      class Employee {
        constructor(id, name, description, manager_id, elve) {
          this.id = id;
          this.name = name;
          this.description = description;
          this.manager_id = manager_id;
          this.level = this.level;
          this.emps = [];
        }
      }

      let newemp = new Employee(
                    tmpres[0].id,
                    tmpres[0].name,
                    tmpres[0].description,
                    tmpres[0].manager_id,
                    tmpres[0].level
                  );

      let curr_mngid = tmpres[0].id;
      tmpres.splice(0, 1);
      dataMapObj.set(newemp.id, newemp);

      let mngr = null;
      let curr_emps = [ newemp ];
      while (tmpres.length) {
        for (let i=0; i < tmpres.length; i++) {
          for (let j=0; j < curr_emps.length; j++) {
            if (tmpres[i].manager_id == curr_emps[j].id) {
              mngr = curr_emps[j];
              const newemp2 = new Employee(
                              tmpres[i].id,
                              tmpres[i].name,
                              tmpres[i].description,
                              tmpres[i].manager_id,
                              tmpres[i].level
                            );
              mngr.emps.push(newemp2);
              curr_emps.push(newemp2); 
              dataMapObj.set(newemp2.id, newemp2);               
              tmpres.splice(i,1);
              break;
            }
          }
          
          if (mngr) {
            mngr = null;
            break;
          }
        }
      }

      const newArr = [ newemp ];
      setDataArr(newArr);
      setDataMap(dataMapObj);

      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchData();
  }, []); 


  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <RootContent orgchartlen={dataArr.length} loaddata={fetchData}/>

      <OrgChartNode 
        orgchart={dataArr} 
        loaddata={fetchData}
        datamap={dataMap}
      />
    </div>
  );
}
export default App
