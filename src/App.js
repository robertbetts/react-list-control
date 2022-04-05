import './App.css';
import ListControl from "./components/ListControl";
import {languages, countries} from "./reference/CommonDataLookups";

function App() {

  const colProps = [
    {
      name: 'First Name',
      value: 'firstName',
      type: 'string',
    },
    {
      name: 'Last Name',
      value: 'lastName',
      type: 'string',
    },
    {
      name: 'Date of Birth',
      value: 'dob',
      type: 'date',
    },

    {
      name: 'Client Type',
      value: 'clientType',
      type: 'string',
    },
    {
      name: "Language",
      value: "language",
      type: "surrogate",
      lookup: () => {return languages.map((item)=>{return {value:item.code, label:item.name}})}
    },
    {
      name: "Country",
      value: "country",
      type: "textItem",
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
    }       
  ]


  const data = [
    {
      clientID : "123456",
      firstName: "Robert",
      lastName: "Betts",
      clientType: "Individual",
      language: {value:"af", label:"Afrikaans"},
      country: {value:"ZA", text:"South Africa"},
      rating: 97.54632,
      approved: false,
      dob: '1971-09-20',
    },
    {
      clientID : "123477",
      firstName: "Claire",
      lastName: "Betts",
      clientType: "Individual",
      language: {value:"en", label:"English"},
      country: {value:"GB", text:"United Kingdom"},
      rating: 98.5,
      approved: true,
      dob: '2000-06-26',
    }    
  ]


  return (
    <div className="App">
      <ListControl 
        title='Test List Control'
        colProps={colProps}
        data={data}
        />
    </div>
  );
}

export default App;
