import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';
import {languages, countries} from "./CommonDataLookups";

export const clientDataRows = (numOfRows=20) => {

    const clientDataset = [];

    const fakeCountry = () => {
        let surrogate = { "value": "GB", "text": "United Kingdom" };
        const alpha2 = faker.address.countryCode('alpha-2');
        countries.map((item) => {
            if (item.code === alpha2) {
                surrogate = { "value": alpha2, "text": item.name };
            }
            return item;
        })
        return surrogate
    }

    for (let i=0; i <= numOfRows; i++) {
        const country = fakeCountry();
        clientDataset.push({
            clientID : uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            clientType: {value:"individual", label:"Individual"},
            language: {value:"an", label:"English"},
            country: country,
            rating: faker.datatype.float({ min: 75, max: 100, precision: 0.001 }),
            approved: false,
            dob: faker.date.between("1900-01-01", "1984-12-31").toISOString().split('T')[0],
            notes: faker.lorem.text(),
        })
    }

    return clientDataset;
} 


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


export const sampleSchema = () => {

    const schema:{[key: string]: any} = {};

    for (let z=0; z <= 3; z++) {    

        let schemaName = "fakeSchema" + z

        const schemaProp = {
            schemaName: schemaName,
            tables: {} as {[key: string]: any},
        }

        const numOfTables = faker.datatype.number({ min: 1, max: 2, precision: 1 });
        for (let i=0; i <= numOfTables; i++) {    

            let tableName = "fakeTable" + i 
            const tableProp = {
                schemaName: schemaName,
                tableName: tableName,
                columns: [] as any[],
            }
            const numOfCols = faker.datatype.number({ min: 2, max: 10, precision: 1 });
            for (let j=0; j <= numOfCols; j++) {
                const colName = faker.database.column();
                tableProp.columns.push({
                    displayName: colName,
                    name: colName,
                    type: 'string',
                    required: true,
                });
            }
            schemaProp.tables[tableName] = tableProp;

        }
        schema[schemaName] = schemaProp;
    }

    return {
        "ClientDB" : {
            schemaName: "ClientDB",
            tables: {
              "client":{
                schemaName: "ClientDB",
                tableName: "client",
                columns: colProps,
              }
            },
        },    
        ...schema
    }
}