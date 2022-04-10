import './App.css';

// import ListControl from "./components/ListControl";
import SchemaViewControl from "./components/SchemaViewControl";

import { clientDataRows, sampleSchema } from "./reference/FakeSampleData.ts"

function App() {

  // const listControl = <ListControl 
  //   title='Test List Control'
  //   colProps={colProps}
  //   data={sample_client_data}
  //   />
  // console.log(listControl);
  // return (
  //    {listControl}
  //   </div>
  // );


  const fetchTableData = (schemaName, tableName, offset=0, limit=20) => {
    // console.log("fetchTableData", schemaName, tableName, offset, limit);
    let data = []
    if (schemaName === "ClientDB" && tableName === "client") {
        data = clientDataRows();
        // console.log(data);
    }
    return {
      count: data.length,
      data: data,
    }
  }

  return (
    <div className="App">
      <SchemaViewControl
        schemaDictionary = {sampleSchema() }
        fetchDataFunction={fetchTableData}
      />
    </div>
  );
}

export default App;
