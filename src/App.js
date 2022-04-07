import './App.css';

import ListControl from "./components/ListControl";
import {languages, countries} from "./reference/CommonDataLookups";

import SchemaViewControl from "./components/SchemaViewControl";
import schemaDataSample from './schema_data/sample_schema.json';


function App() {

  const colProps = [
    {
      name: 'First Name',
      value: 'firstName',
      type: 'string',
      required: true,
    },
    {
      name: 'Last Name',
      value: 'lastName',
      type: 'string',
      required: true,
    },
    {
      name: 'Date of Birth',
      value: 'dob',
      type: 'date',
      required: true,
    },

    {
      name: 'Client Type',
      value: 'clientType',
      type: 'labelItem',
      required: true,
      lookup: () => {return [{value: "individual", label: "Individual"},
                             {value: "non-individual", label: "Non-Individual"},
                            ]},
    },
    {
      name: "Language",
      value: "language",
      type: "surrogate",
      required: true,
      lookup: () => {return languages.map((item)=>{return {value:item.code, label:item.name}})}
    },
    {
      name: "Country",
      value: "country",
      type: "textItem",
      required: true,
      lookup: () => {return countries.map((item)=>{return {value:item.code, text:item.name}})}
    },
    {
      name: 'Client ID',
      value: 'clientID',
      type: 'string',
    },
    {
      name: 'Rating',
      value: 'rating',
      type: 'float',
      decimals: 2,
    },
    {
      name: 'Approved',
      value: 'approved',
      type: 'boolean',
    },
    { name: "Notes",
      value: "notes",
      type: "text",
    }
  ]


  const data = [
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
    data={data}
    />
  console.log(listControl);


  const fetchTableData = (schemaName, tableName, offse0, limit=20) => {
    return [data.length, data]
  }

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
