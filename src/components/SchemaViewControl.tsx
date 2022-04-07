/**
 * This React Module and set of components are designed to provide a Model Driven UX experience
 * 
 * It is assumed that that a single backend API will handle the interaction for all schemas
 * defined in the SchemaDataDictionary
 */


import * as React from "react";
import { ListGroup, Tabs, Tab } from "react-bootstrap";
import { Folder, Table } from 'react-bootstrap-icons';

import ListControl from "./ListControl";
import { ListColProp } from "./ListControl";


/**
 * The most common data types found. surrogate typically used for foreign key fields,
 * labelItem and textItem are conveniance type to support emum or other data lookups
 */
export type SchemaColumnTypes = "string" | "text" | "integer" | "float" | "boolean" | "date" | "surrogate" | "labelItem" | "textItem";


export interface SchemaForeignKey {
    schemaName: string, 
    tableName: string, 
    value: string, 
    label: string,
}

/**
 * The combination of (schemaName, tableName, name) are expected to be unique within the entire SchemaDictionary
 */
export interface SchemaColumnProp {
    schemaName: string,
    tableName: string,
    name: string,
    displayName?: string,
    type: SchemaColumnTypes,
    primaryKey: boolean,
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

export function schemaDictionaryFactory(schemaData:any) {
    const validSchemaData = {};

    return new SchemaDictionary(validSchemaData);
}


export interface TableControlProps {
    schema: string,
    table: string,
    tableProps: SchemaTableProp[],
  }

  export interface TableControlState {
    data: any;
  }

/**
 * This component will represent a view over a database table. This does not have to be
 * and actual database table but some structure similar in characteristics i.e. rows of
 * data where each row has one or more fields/columns.
 * 
 * A schema definition is required, which informs the component who to interact with
 * the underlying data.
 * 
 * This component does not by design support data paterns where there could exist 
 * multiple identical rows. This could result in underfined behaviors. 
 * 
 * * fields that are a foriegn key to other tables will be typically be represented as 
 *   a surrogate values {schema, value, label} where schema will identify the remote 
 *   table, lookup value column and label column.
*/
class TableViewControl extends React.Component<TableControlProps, TableControlState> {

    constructor(props:TableControlProps) {
      super(props)
    }

    render() {
        return <></>
    }
}

/**
 * schemaDictionary first order represents schemaName, second order tableName with final order with instances 
 * of SchemaColumnProp
 * schemaDictionaryIndex 
 */
 export interface SchemaViewControlProps {
    schemaDictionary: any,
    fetchDataFunction: (schemaName:string, tableName:string, offset?:number, limit?:number) => [number, any[]],
  }

export interface SchemaViewControlState {
    schemaTableSelected: SchemaTableProp,
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
        let result = this.props.fetchDataFunction(schemaName, tableName, offset, limit).slice(offset, limit);
        return {
            count: result[0],
            data: result[1],
        }
    }

    selectTable(schemaTableProp:SchemaTableProp) {
        this.setState({
            schemaTableSelected: schemaTableProp,
            tableData: [],
            tableDataOffet: 0,
            tableDataLimit: 20,
        });
        let result = this.fetchTableData(schemaTableProp.schemaName, schemaTableProp.tableName);
        this.setState({tableData: result.data as []});
    }

    mapSchemaTables(schemaProp:any) {
        const self = this;
        const style = { paddingLeft: "40px", boarder:"none", paddingTop:"4px", paddingBottom:"4px", cursor:"pointer" };
        const className = "border-0"
        if (Object.keys(this.props.schemaDictionary).length === 0) {
            return (<ListGroup.Item key={`${schemaProp.schemName}.noSchemas`} disabled>No Schema Tabless</ListGroup.Item>);
        } else {
            return (<>
                {   Object.keys(schemaProp.tables).map( (key:any) => {
                        return (
                            <ListGroup.Item 
                                key={`table.${schemaProp.schemName}.${key}`}
                                style={style}
                                className={className}
                                >
                                <span
                                    onClick={() => self.selectTable(schemaProp.tables[key])}
                                    >
                                    <Table/>{" "}{key}
                                </span>
                            </ListGroup.Item>
                        )
                    })
                }
            </>)
        }
    }

    mapSchema() {
        const className = "border-0"
        if (Object.keys(this.props.schemaDictionary).length === 0) {
            return (<ListGroup.Item key="noSchemas" disabled>No Data Schemas</ListGroup.Item>);
        } else {
            return (<>
                {   Object.keys(this.props.schemaDictionary).map( (key:any) => {
                        return (
                            <ListGroup.Item 
                                key={`schema.${key}`}
                                className={className}
                                >
                                <Folder />{" "}{key}
                                {this.mapSchemaTables(this.props.schemaDictionary[key])}
                            </ListGroup.Item>
                        )
                    })
                }
            </>)
        }
    }


    viewTable() {

        const mapColProps = (colProps:any) => {
            return colProps.map(
                (item:any) => {
                    return {
                        name: item.displayName,
                        value: item.name,
                        type: item.type,
                        decimals: item.decimals,
                    }
                }
            )
        }



        if (this.state.schemaTableSelected) {
            const schemaTableProp = this.state.schemaTableSelected;

            const SchemaColumnPropDisplay = [
                {name: "schemaName", value: "schemaName", type:"string"},
                {name: "tableName", value: "tableName", type:"string"},
                {name: "name", value: "name", type:"string"},
                {name: "type", value: "type", type:"string"},
                {name: "primaryKey", value: "primaryKey", type:"string"},
            ]

            return (<>
                <div className="row"><h3>{`${schemaTableProp.schemaName}.${schemaTableProp.tableName}`}</h3></div>
                <div className="row">

                <Tabs defaultActiveKey="data" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="data" title="Browse Data">
                        <ListControl 
                            colProps={mapColProps(schemaTableProp.columns)}
                            data={this.state.tableData}
                            />
                    </Tab>
                    <Tab eventKey="properties" title="Properties">
                        <ListControl 
                            colProps={SchemaColumnPropDisplay as ListColProp[]}
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
