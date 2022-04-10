/**
 * This React Module and set of components are designed to provide a Model Driven UX experience
 * 
 * It is assumed that that a single backend API will handle the interaction for all schemas
 * defined in the SchemaDataDictionary
 */


import * as React from "react";
import { useState } from "react";
import { ListGroup, Tabs, Tab } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

import ListControl from "./ListControl";
import { ListColProp } from "./ListControl";


/**
 * The most common data types found. surrogate typically used for foreign key fields,
 * labelItem and textItem are conveniance type to support emum or other data lookups
 * 
 * PLEASE NOTE: Keep these values in sync with ListControl, ListColType
 * 
 */
export type SchemaColumnTypes = "string" | "text" | "integer" | "float" | "boolean" | "date" | "surrogate" | "labelItem" | "textItem";


export interface SchemaForeignKey {
    schemaName: string, 
    tableName: string, 
    value: string, 
    label: string,
}

/**
 * The combination of (schemaName, tableName, name) are expected to be unique within the entire SchemaDictionary.
 * 
 * PLEASE NOTE: SchemaColumnProp will get mapped to ListControl, ListColProp
 * 
 * primaryKey will default to false, when not assigned.
 * 
 * Where displayName below is not provided, it will default to the value of name
 * The decimal attribute, is only used for display rendering. when undefined will result in no rounding applied.
 * 
 * required will default to false, when not assigned. If required, then the underlying persistance requires
 * a value for this col.
 * 
 */
export interface SchemaColumnProp {
    schemaName: string,
    tableName: string,
    name: string,
    displayName?: string,
    type: SchemaColumnTypes,
    required?: boolean,
    primaryKey?: boolean,
    defaultValue?: any,
    decimals?: number,
    foreignKey?: SchemaForeignKey,
    editRequired?: boolean,
    editReadOnly?: boolean,
    listDisplay?: boolean,
    formDisplay?: boolean,
}


export interface SchemaTableProp {
    schemaName: string,
    tableName: string,
    primaryKeys?: SchemaColumnProp[],
    columns: SchemaColumnProp[],
}

export interface SchemaProp {
    schemaName: string,
    tables: {},
}

/**
 * A convenience class to store and retrieve schema related information
 */
export class SchemaDictionary {
    schemaData = {};
    constructor(schemaData:{}) {
        this.schemaData = schemaData
    }
}

export const SchemaColumnPropDisplay:ListColProp[] =[
    {displayName: "Name", name: "name", type:"string"},
    {displayName: "Type", name: "type", type:"string"},
    {displayName: "Primary Key", name: "primaryKey", type:"boolean"},
    {displayName: "Required", name: "required", type:"boolean"},
]

export interface TableControlProps {
    schema: string,
    table: string,
    tableProps: SchemaTableProp[],
  }

  export interface TableControlState {
    data: any;
  }

/**
 * Created this component function outside of SchemaViewControl class
 * in order to have a less complicted method of controling the display
 * state for the Caret open and close feature
 */
const SchemaListItem = (props:any) => {
    const className = "border-0"
    const style = {cursor:"pointer" };
    const [open, setOpen] = useState(false);

    return (
        <ListGroup.Item 
            key={`schema.${props.schemaProp.schemaName}`}
            className={className}
            style={ {paddingTop:"4px", paddingBottom:"4px"} }
            >
            <span 
                style={style}
                onClick={() => setOpen(!open)}
                >
                { open ? <Icon.CaretDownFill/> : <Icon.CaretRightFill/>}
            </span>
            <Icon.Folder />{" "}{props.schemaProp.schemaName}
            {open && props.viewControl.mapSchemaTables(props.schemaProp)}
        </ListGroup.Item>   
    )
}


function isObject(object:Object) {
    return object != null && typeof object === 'object';
}
  
function deepEqual(object1:any, object2:any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
        (areObjects && !deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
        ) {
        return false;
        }
    }
    return true;
}

/**
 * Extending ListControl to refresh its internal state
 * when a new schmea table is selected.
 */
class DataListControl extends ListControl {
    static getDerivedStateFromProps(props:any, state:any) {
        if (!deepEqual(props.colProps, state.colProps) || props.data.length === 0)  {
          return {
            colProps: props.colProps,
            data: props.data,
          };
        }
        return null;
      }    
}

/**
 * Extending ListControl to refresh its internal state
 * when a new schmea table is selected.
 */
class PropertiesListControl extends ListControl {

    static getDerivedStateFromProps(props:any, state:any) {
        if (!deepEqual(props.data, state.data) || props.data.length === 0)  {
          return {
            colProps: props.colProps,
            data: props.data,
          };
        }
        return null;
      }    
}


/**
 * schemaDictionary first order represents schemaName, second order tableName with final order with instances 
 * of SchemaColumnProp
 * schemaDictionaryIndex 
 */
 export interface SchemaViewControlProps {
    schemaDictionary: any,
    fetchDataFunction: (schemaName:string, tableName:string, offset?:number, limit?:number) => {count:number, data:any[]},
  }

export interface SchemaViewControlState {
    schemaTableSelected: SchemaTableProp|null,
    tableData: [],
    tableDataOffet: number,
    tableDataLimit: number,
}

class SchemaViewControl extends React.Component<SchemaViewControlProps, SchemaViewControlState> {

    constructor(props:SchemaViewControlProps) {
        super(props)
        this.mapSchema = this.mapSchema.bind(this);
        this.mapSchemaTables = this.mapSchemaTables.bind(this);
        this.selectTable = this.selectTable.bind(this);
        this.viewTable = this.viewTable.bind(this);

        this.state = {
            schemaTableSelected: null,
            tableData: [],
            tableDataOffet: 0,
            tableDataLimit: 20,
        }
    }

    fetchTableData(schemaName:string, tableName:string, offset:number=0, limit:number=20) {
        return this.props.fetchDataFunction(schemaName, tableName, offset, limit);
    }

  /**
   *  Data is ingested as a function or an array and the attribute row_id
   *  is added to each array item.
   *  TAKE NOTE. If row_id exists in the source dataset, it will overide 
   *  the generated row_id attribute.
   */
   parseData(data:any) {
    return data.map((item:any, index:any) => {return { row_id:index, ...item }})
  }

    selectTable(schemaTableProp:SchemaTableProp) {
        const self = this;
        const dataResult = this.fetchTableData(schemaTableProp.schemaName, schemaTableProp.tableName);
        // console.log("selectTable", schemaTableProp, dataResult);
        this.setState((state, props) => ({
            schemaTableSelected: schemaTableProp,
            tableData: self.parseData(dataResult.data),
            tableDataOffet: 0,
            tableDataLimit: 20,
        }));
    }

    mapSchemaTables(schemaProp:any) {
        const self = this;
        const style = { paddingLeft: "40px", boarder:"none", paddingTop:"4px", paddingBottom:"4px", cursor:"pointer" };
        const className = "border-0"
        if (Object.keys(schemaProp.tables).length === 0) {
            return (<ListGroup.Item key={`${schemaProp.schemaName}.noSchemas`} disabled style={{paddingLeft: "40px", border:"none"}}>No Tabless</ListGroup.Item>);
        } else {
            return (<>
                {   Object.keys(schemaProp.tables).map( (key:any) => {
                        return (
                            <ListGroup.Item 
                                key={`table.${schemaProp.schemaName}.${key}`}
                                style={style}
                                className={className}
                                >
                                <span
                                    onClick={() => self.selectTable(schemaProp.tables[key])}
                                    >
                                    <Icon.Table/>{" "}{key}
                                </span>
                            </ListGroup.Item>
                        )
                    })
                }
            </>)
        }
    }

    mapSchema() {
        if (Object.keys(this.props.schemaDictionary).length === 0) {
            return (<ListGroup.Item key="noSchemas" disabled>No Data Schemas</ListGroup.Item>);
        } else {
            return (<>
                {   Object.keys(this.props.schemaDictionary).map( (key:any) => {
                        return (
                            <SchemaListItem
                                key={`schema.${key}`}
                                viewControl={this}
                                schemaProp={this.props.schemaDictionary[key]}
                                />
                        )
                    })
                }
            </>)
        }
    }


    viewTable() {
        if (this.state.schemaTableSelected) {
            const schemaTableProp = this.state.schemaTableSelected;

            return (<>
                <div className="row"><h3>{`${schemaTableProp.schemaName}.${schemaTableProp.tableName}`}</h3></div>
                <div className="row">

                <Tabs defaultActiveKey="data" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="data" title="Data">
                        <DataListControl 
                            colProps={schemaTableProp.columns}
                            data={this.state.tableData}
                            onRowItemUpdate={(item:any)=>{console.log("updated", item)}}
                            />
                    </Tab>
                    <Tab eventKey="properties" title="Properties">
                        <PropertiesListControl 
                            colProps={SchemaColumnPropDisplay}
                            data={schemaTableProp.columns}
                            />
                    </Tab>
                </Tabs>

                </div>

            </>)
        } else {
            return (<><h3>Select a Schema Table</h3></>)
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-2">
                    {this.mapSchema()}
                </div>
                <div className="col-10">
                    {this.viewTable()}
                </div>
            </div>
        )
    }
}

export default SchemaViewControl;
