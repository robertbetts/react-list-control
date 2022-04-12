import * as React from "react";
import './App.css';

import SchemaViewControl from "./components/SchemaViewControl";
import { clientDataRows, sampleSchema } from "./reference/FakeSampleData.ts"

export const fetchTableData = (schemaName, tableName, offset=0, limit=20) => {
  let data = []
  if (schemaName === "ClientDB" && tableName === "client") {
      data = clientDataRows();
  }
  return {
    count: data.length,
    data: data,
  }
}

function App() {
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
