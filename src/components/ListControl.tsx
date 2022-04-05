import * as React from "react";
import { Form, Table, Modal, Button } from  'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";


export type ListColType = "string"|"integer"|"float"|"boolean"|"surrogate"|"labelItem"|"textItem";


export interface ListColProp {
  name: string,
  value: string | React.ReactChild | React.ReactChildren,
  type: ListColType,
  decimals?: number,
  listHide?: boolean,
  formRO?: boolean,
  formRequired?: boolean,
  onCellClick?: (event:any, colProp:any, rowData:any, colProps:any) => {},
}

export interface ListControlProps {
  title?: string,
  showIndex?: boolean,
  data: [],
  colProps : ListColProp[],
  onRowClick?: (event:any, rowData:any, colProps:any) => {},
  onCellClick?: (event:any, colProp:any, rowData:any, colProps:any) => {},
  updateRowItem: (updatedItem:any) => {}
}

export interface ListControlState {
  data: any,
  selectedRowItem: any,
  showFormModal: boolean,
}


function RenderFormField(props:any) {
  const stringTypes = ['date', 'string', 'email', 'url', 'tel'];
  const numericTypes = ['float', 'integer'];
  const formRequired = props.colProp.formRequired === undefined ? true : props.colProp.formRequired;
  const formRO = props.colProp.formRO === undefined ? false : props.colProp.formRequired;

  const controlProps = {
    required :formRequired,
    onChange: props.onChange,
    name: props.colProp.value, 
    readOnly: formRO,
  }
  return (
    <Form.Group className="col-6">
      <Form.Label>{props.colProp.name}</Form.Label>
      { stringTypes.indexOf(props.colProp.type) > -1 && 
        <Form.Control { ...controlProps } type={props.colProp.type} value={props.rowData[props.colProp.value]} placeholder="" />
      }
      { numericTypes.indexOf(props.colProp.type) > -1 && 
        <Form.Control { ...controlProps } type={props.colProp.type} value={props.rowData[props.colProp.value]} placeholder="" />
      }
      { props.colProp.type === "boolean" && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.value] ? 1 : 0}>
        <option value={1}>True</option>
        <option value={0}>False</option>
        </Form.Select>
      }
      { (props.colProp.type === "surrogate" || props.colProp.type === "labelItem") && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.value].value}>
          {props.colProp.lookup().map((item:any, index:any) =>{
              return <option key={index} value={item.value}>{item.label}</option>
            }
          )}
        </Form.Select>
      }
      { props.colProp.type === "textItem" && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.value].value}>
          {props.colProp.lookup().map((item:any, index:any) =>{
              return <option key={index} value={item.value}>{item.text}</option>
            }
          )}
        </Form.Select>
      }

    </Form.Group>
  )
}

class ListItemForm extends React.Component<any, any> {
  constructor(props:any) {
    super(props)

    this.onfieldChange = this.onfieldChange.bind(this); 

    this.state = {
      dirty: false,
      rowData: props.rowData,
    }
  }

  onfieldChange(event:any) {
    const fieldName = event.target.name;
    let fieldVal = event.target.value;
    let dirty = false;

    const colProp = this.props.colProps.find((item:any) => item.value===fieldName);

    if (colProp) {
      console.log("onfieldChange", colProp.value, this.state.rowData[fieldName], "=>", fieldVal);

      if (colProp.type === "textItem") {
        if (fieldVal !== this.state.rowData[fieldName]) {
          dirty = true;
        }
        fieldVal = {value:fieldVal, text:event.nativeEvent.target[event.target.selectedIndex].text}
      } else if (colProp.type === "surrogate" || colProp.type === "labelItem") {
        if (fieldVal !== this.state.rowData[fieldName]) {
          dirty = true;
        }
        fieldVal = {value:fieldVal, label:event.nativeEvent.target[event.target.selectedIndex].text}
      } else if (fieldVal !== this.state.rowData[fieldName]) {
        dirty = true;
      }
      this.setState({
        dirty: dirty,  
        rowData: {...this.state.rowData, [fieldName]: fieldVal}
      });
      this.props.updateRowItem(dirty, {...this.state.rowData, [fieldName]: fieldVal})
    }
  }

  render() {
    return (
      <Form>
        <div className="row">
          { this.props.colProps.map( (colProp:any, index:number) => {
            return (
              <RenderFormField
                key={index}
                colProp={colProp}
                rowData={this.state.rowData}
                onChange={this.onfieldChange}
              />
            )
            })
          }
        </div>
      </Form>
    )
  }
}

function RenderDataItem(props:any) {

  const dataValue = props.rowData[props.colProp.value];
  let displayValue: any;
  if (props.colProp.type === "float") {
    displayValue = parseFloat(dataValue).toFixed(props.colProp.decimals)

  } else if (props.colProp.type === "boolean") {
    displayValue = dataValue ? "True" : "False";

  } else if ((props.colProp.type === "labelItem") || (props.colProp.type === "surrogate" )) {
    displayValue = dataValue.label;

  } else if (props.colProp.type === "textItem") {
    displayValue = dataValue.text;
    
  } else {
    displayValue = dataValue
  }
  // console.log(props.colProp.type, displayValue, props.colProp );
  return <>{"" + displayValue}</>
}

function ListHeader(props:any) {
  return (
    <thead>
    <tr>
      { props.showIndex && 
        <th key={0}>#</th>
      }
      {/* .filter((item: { listHide: boolean; }) => !!item.listHide ) */}
      { props.colProps.map( (colProp:any, index:number) => {
          return (
            <th key={index+1}>{colProp.name}</th>
          )
        })
      }
    </tr>
    </thead>
  )
}

function ListData(props: any) {
  return (
    <tbody>
      { props.data.map( (rowData:any, rowIndex:number) => {
          return (
            <tr key={rowIndex} onClick={(e) => props.onRowClick(e, rowData, props.colProps)}>
              { props.showIndex && 
                <td key="0">{rowIndex}</td>
              }
              {/* .filter((item: { listHide: boolean; }) => !!item.listHide ) */}
              { props.colProps.map( (colProp:any, propIndex:number) => {
                  return (
                    <td key={propIndex+1}>
                      <RenderDataItem 
                        rowData={rowData}
                        colProp={colProp}
                      />
                    </td>
                  )
              })}
            </tr>
          )
          })
        }
    </tbody>
  )
}

export default class ListControl extends React.Component<ListControlProps, ListControlState> {
  constructor(props:ListControlProps) {
    super(props)

    this.onRowClick = this.onRowClick.bind(this); 
    this.handleFormModalClose = this.handleFormModalClose.bind(this); 
    this.handleFormModalSave = this.handleFormModalSave.bind(this); 
    this.updateRowItem = this.updateRowItem.bind(this); 

    this.state = {
      data: this.parseData(props.data).map((item:any, index:any) => {return { row_id:index, ...item }}),
      selectedRowItem: null,
      showFormModal: false,
    }
  }

  parseData(data:any) {
    if (typeof(data) === "function" ) {
        return data();
    } else {
      return data;
    }

  }

  handleFormModalClose() {
    console.log("handleFormModalClose");
    this.setState({
      showFormModal: false,
      selectedRowItem: null,
    });
  }


  handleFormModalSave() {
    const selectedRowItem = this.state.selectedRowItem;
    const newData = this.state.data.map((item:any) => {
      if (item.row_id === selectedRowItem.row_id) {
        return selectedRowItem
      } else {
        return item
      }
    })
    this.setState({data:newData});
    this.setState({
      showFormModal: false,
      selectedRowItem: null,
    });
  }

  onRowClick(event:any, rowData:any) {
    if (this.props.onRowClick) {
      return this.props.onRowClick(event, rowData, this.props.colProps);
    } else {
      this.setState({
        selectedRowItem:rowData,
        showFormModal: true,
      });
    }
  }

  updateRowItem(dirty:boolean, updatedItem:any) {
    if (dirty) {
      console.log("dirty updated row item");
      this.setState({selectedRowItem: updatedItem});
    }
  }

  render() {

    return (
      <div className="row" style={{margin:"0px"}}>
        { this.props.title &&
            <span>{this.props.title}</span>
        }
        <Table striped hover size="sm">
          <ListHeader 
            colProps={this.props.colProps} 
            />
          <ListData 
            colProps={this.props.colProps}
            data={this.state.data}
            onRowClick={this.onRowClick}
            />
        </Table>
          <Modal show={this.state.showFormModal} size="lg">
          <Modal.Header>
            <Modal.Title>Row Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <ListItemForm
                rowData={this.state.selectedRowItem}
                colProps={this.props.colProps}
                updateRowItem={this.updateRowItem}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleFormModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleFormModalSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
