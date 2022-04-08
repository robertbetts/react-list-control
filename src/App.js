import './App.css';

import ListControl from "./components/ListControl";
import {languages, countries} from "./reference/CommonDataLookups";

import SchemaViewControl from "./components/SchemaViewControl";
import schemaDataSample from './schema_data/sample_schema.json';


function App() {

  const colProps = [
    {
      displayName: 'First Name',
      name: 'firstName',
      type: 'string',
      required: true,
    },
    {
      displayName: 'Last Name',
      name: 'lastName',
      type: 'string',
      required: true,
    },
    {
      //displayName: 'Date of Birth',
      name: 'dob',
      type: 'date',
      required: true,
    },

    {
      displayName: 'Client Type',
      name: 'clientType',
      type: 'labelItem',
      required: true,
      lookup: () => {return [{value: "individual", label: "Individual"},
                             {value: "non-individual", label: "Non-Individual"},
                            ]},
    },
    {
      displayName: "Language",
      name: "language",
      type: "surrogate",
      required: true,
      lookup: () => {return languages.map((item)=>{return {value:item.code, label:item.name}})}
    },
    {
      displayName: "Country",
      name: "country",
      type: "textItem",
      required: true,
      lookup: () => {return countries.map((item)=>{return {value:item.code, text:item.name}})}
    },
    {
      displayName: 'Client ID',
      name: 'clientID',
      type: 'string',
      primaryKey: true,
    },
    {
      displayName: 'Rating',
      name: 'rating',
      type: 'float',
      decimals: 2,
    },
    {
      displayName: 'Approved',
      name: 'approved',
      type: 'boolean',
    },
    { displayName: "Notes",
      name: "notes",
      type: "text",
    }
  ]


  const sample_client_data = [
    {
      clientID : "123456",
      firstName: "Robert",
      lastName: "Betts",
      clientType: {value:"individual", label:"Individual"},
      language: {value:"af", label:"Afrikaans"},
      country: {value:"ZA", text:"South Africa"},
      rating: 97.54632,
      approved: false,
      dob: '1971-09-20',
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      clientID : "123477",
      firstName: "Claire",
      lastName: "Betts",
      clientType: {value:"individual", label:"Individual"},
      language: {value:"en", label:"English"},
      country: {value:"GB", text:"United Kingdom"},
      rating: 98.5,
      approved: true,
      dob: '2000-06-26',
      notes: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    }    
  ]

  const listControl = <ListControl 
    title='Test List Control'
    colProps={colProps}
    data={sample_client_data}
    />
  console.log(listControl);


  const fetchTableData = (schemaName, tableName, offset=0, limit=20) => {
    console.log("fetchTableData", schemaName, tableName, offset, limit);
    let data = []
    if (schemaName === "ClientDB" && tableName === "client") {
        data = sample_client_data
    }
    return {
      count: data.length,
      data: data,
    }
  }

  const testSchema = schemaDataSample
  testSchema["ClientDB"].tables["client"].columns = colProps

  const schemaViewControl = <SchemaViewControl
    schemaDictionary = {schemaDataSample}
    fetchDataFunction={fetchTableData}
    />
  console.log(schemaViewControl);

  return (
    <div className="App">
      {/* {listControl} */}
      {schemaViewControl}
    </div>
  );
}

export default App;
