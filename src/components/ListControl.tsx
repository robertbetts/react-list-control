/**
 * This module provides a template for displaying and editing a list of objects. 
 */
import * as React from "react";
import { Form, Table, Modal, Button } from  'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export type ListColType = "string" | "text" | "integer" | "float" | "boolean" | "date" | "surrogate" | "labelItem" | "textItem";

/**
 * Where displayName below is not provided, it will default to the value of name
 * 
 * The decimal attribute, is only used for display rendering. when undefined will result in no rounding applied.
 * 
 * primaryKey will default to false, when not assigned.
 * 
 * required will default to false, when not assigned. If required, then the underlying persistance requires
 * a value for this col.
 * 
 */
export interface ListColProp {
  displayName?: string,
  name: string,
  type: ListColType,
  required?: boolean, 
  primaryKey?: boolean,
  decimals?: number,
  listHide?: boolean,
  formRO?: boolean,
  onCellClick?: (event:any, colProp:any, rowData:any, colProps:any) => void,
  lookup?: () => [],
}

export interface RenderedFormFieldProps {
  rowData: any,
  colProp : ListColProp,
  fieldIndex: number,
  onChange: (event:any) => void,
  regularClass?: string,
  wideClass?: string,
}

export const RenderedFormField = (props:RenderedFormFieldProps) => {

  const stringTypes = ['date', 'string', 'email', 'url', 'tel'];
  const numericTypes = ['float', 'integer'];

  const colProp = props.colProp;
  const required = colProp.required === undefined ? true : colProp.required;
  const formRO = colProp.formRO === undefined ? false : colProp.required;

  const controlId = "ValidationDefault" + props.fieldIndex

  const regularClass = props.regularClass === undefined ? "col-6" : props.regularClass;
  const wideClass = props.wideClass === undefined ? "col-12" : props.wideClass;
  let className = regularClass
  if (colProp.type === "text") {
    className = wideClass
  }

  let controlProps = {
    required : required,
    onChange: props.onChange,
    name: colProp.name, 
    readOnly: formRO,
  }

  const displayName = props.colProp.displayName === undefined ? props.colProp.name : props.colProp.displayName;

  return (
    <Form.Group className={className} controlId={controlId}>
      <Form.Label>{displayName}</Form.Label>
      { stringTypes.indexOf(props.colProp.type) > -1 && 
        <Form.Control { ...controlProps } type={props.colProp.type} value={props.rowData[props.colProp.name]} placeholder="" />
      }
      { props.colProp.type === "text" && 
        <Form.Control { ...controlProps } as="textarea" rows={3} value={props.rowData[props.colProp.name]} placeholder="" />
      }
      { numericTypes.indexOf(props.colProp.type) > -1 && 
        <Form.Control { ...controlProps } type={props.colProp.type} value={props.rowData[props.colProp.name]} placeholder="" />
      }
      { props.colProp.type === "boolean" && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.name] ? 1 : 0}>
        <option value={1}>True</option>
        <option value={0}>False</option>
        </Form.Select>
      }
      { (props.colProp.type === "surrogate" || props.colProp.type === "labelItem") && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.name].value}>
          {props.colProp.lookup().map((item:any, index:any) =>{
              return <option key={index} value={item.value}>{item.label}</option>
            }
          )}
        </Form.Select>
      }
      { props.colProp.type === "textItem" && 
        <Form.Select { ...controlProps } value={props.rowData[props.colProp.name].value}>
          {props.colProp.lookup().map((item:any, index:any) =>{
              return <option key={index} value={item.value}>{item.text}</option>
            }
          )}
        </Form.Select>
      }
    </Form.Group>
  )
}

export interface RenderedDataItemProps {
  rowData: any,
  colProp : ListColProp,
}

export const RenderedDataItem = (props:RenderedDataItemProps) => {

  const dataValue = props.rowData[props.colProp.name];
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

  if (props.colProp.type === "text") {
    return (
      <span className="d-inline-block text-truncate" style={{maxWidth: "250px"}}>
        {displayValue}
      </span>
      )
  } else {
    return <>{"" + displayValue}</>
  }
  
}

export interface ListItemFormProps {
  rowData: any,
  colProps : ListColProp[],
  onValidSubmit: Function,
  handleFormClose: (event:any) => void,
}

export interface ListItemFormState {
  dirty: boolean,
  validated: boolean,
  rowData: any,
}

class ListItemForm extends React.Component<ListItemFormProps, ListItemFormState> {

  /** 
  * This class property serves a reference pointer to the parent Form HTML element 
  * in order to access its validation features e.g. sumit()
  */
  formRef = React.createRef<HTMLFormElement>();

  constructor(props:any) {
    super(props)

    this.onfieldChange = this.onfieldChange.bind(this); 
    this.submitForm = this.submitForm.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);

    /**
     * The state of validated below, indicates that the forms validation process
     * has completed, it does not reflect the form's validation state.
     */
    this.state = {
      dirty: false,
      validated: false,
      rowData: props.rowData,
    }
  }

  /**
   * Catpure the datachange and transform it to the appropriate underlying structure.
   * 
   * NOTE: No rounding is applied to floats here. colProps.decimals is used
   *       for display purposes only.
   * 
   * @param event
   */
  onfieldChange(event:any) {
    // console.log("onfieldChange");

    const name = event.target.name;
    let fieldVal = event.target.value;
    let dirty = false;
    const colProp = this.props.colProps.find((item:ListColProp) => item.name===name);
    const rowData = this.state.rowData;

    this.formRef.current.checkValidity();

    if (colProp) {
      if (colProp.type === "textItem") {
        if (fieldVal !== rowData[name]) {
          dirty = true;
        }
        fieldVal = {value:fieldVal, text:event.nativeEvent.target[event.target.selectedIndex].text}

      } else if (colProp.type === "surrogate" || colProp.type === "labelItem") {
        if (fieldVal !== rowData[name]) {
          dirty = true;
        }
        fieldVal = {value:fieldVal, label:event.nativeEvent.target[event.target.selectedIndex].text}

      } else if (fieldVal !== rowData[name]) {
        dirty = true;
      }

      /**
       * Only change dirty to false if this.state.dirty is true to prevent a false positive.
       */
      dirty = this.state.dirty ? this.state.dirty : dirty; 

      this.setState({
        validated: true,
        dirty: dirty,  
        rowData: {...this.state.rowData, [name]: fieldVal}
      });
    }
  }

  submitForm(event:any) {
    this.formRef.current.submit()
    // console.log("submitForm", this.state.validated)
  }

  handleSubmit(event:any) {
    const validated = this.formRef.current.checkValidity();
    if (validated === false) {
      event.preventDefault();
      event.stopPropagation();
    } 
    this.setState({
      validated: true,
    });
    // Only update state in parent when the Form passes validation
    if (validated) {
      this.props.onValidSubmit(this.state.dirty, {...this.state.rowData})
    }
  }

  render() {
    return (
      <Form ref={this.formRef} noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
        <div className="row">
          { this.props.colProps.map( (colProp:any, index:number) => {
            return (
              <RenderedFormField
                key={index}
                fieldIndex={index}
                colProp={colProp}
                rowData={this.state.rowData}
                onChange={this.onfieldChange}
              />
            )
            })
          }
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={this.props.handleFormClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Save Changes
          </Button>
        </div>
      </Form>
    )
  }
}


export const ListHeader = (props:any) => {
  return (
    <thead>
      <tr>
        { props.showIndex && 
          <th key={0}>#</th>
        }
        { props.colProps.map( (colProp:any, index:number) => {
            const displayName = colProp.displayName  === undefined ? colProp.name : colProp.displayName;
            const primaryKey = colProp.primaryKey === undefined ? false : colProp.primaryKey;
            const title = primaryKey ? "Primary Key" : "";
            return (
              <th key={index+1} title={title} >{primaryKey && <Icon.Key />}{displayName}</th>
            )
          })
        }
      </tr>
    </thead>
  )
}

export const ListData = (props: any) => {
  return (
    <tbody>
      { props.data.map( (rowData:any, rowIndex:number) => {
          return (
            <tr key={rowIndex} onClick={(e) => props.onRowClick(e, rowData, props.colProps)}>
              { props.showIndex && 
                <td key="0">{rowIndex}</td>
              }
              { props.colProps.map( (colProp:any, propIndex:number) => {
                  return (
                    <td key={propIndex+1}>
                      <RenderedDataItem
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

/**
 * Every object item in data, is expected to have a row_id attribute and its value
 * must be unique for each item in data. if the source of data alread proves a row_id
 * data attribute then the same unique requirements should exist.
 * 
 * For requirements to refresh the state from changes to props, it is advised to
 * extend this class and use approaced like the eventbus for example.
 */
export interface ListControlProps {
  title?: string,
  showIndex?: boolean,
  data: any[],
  colProps : ListColProp[],
  onRowItemUpdate?: (updatedItem:any) => void
  onRowClick?: (event:any, rowData:any, colProps:any) => void,
  onCellClick?: (event:any, colProp:any, rowData:any, colProps:any) => void,
}

export interface ListControlState {
  data: any,
  colProps : ListColProp[],
  selectedRowItem: any | null,
  showFormModal: boolean,
}

export default class ListControl extends React.Component<ListControlProps, ListControlState> {
  constructor(props:ListControlProps) {
    super(props)

    this.onRowClick = this.onRowClick.bind(this); 
    this.handleFormModalClose = this.handleFormModalClose.bind(this); 
    this.handleFormModalSave = this.handleFormModalSave.bind(this); 

    this.state = {
      data: this.props.data,
      colProps: this.props.colProps,
      selectedRowItem: null,
      showFormModal: false,
    }
  }

  handleFormModalClose() {
    this.setState({
      showFormModal: false,
      selectedRowItem: null,
    });
  }


  handleFormModalSave(dirty:boolean, updatedItem:any) {
    let newData = this.state.data;
    if (dirty) {
      newData = this.state.data.map((item:any) => {
        if (item.row_id === updatedItem.row_id) {
          return updatedItem
        } else {
          return item
        }
      })
    } 
    this.setState({
      data: newData,
      showFormModal: false,
      selectedRowItem: null,
    });
    if (this.props.onRowItemUpdate) {
      this.props.onRowItemUpdate(updatedItem);
    }
  }

  onRowClick(event:any, rowData:any) {
    // console.log("ListControl.onRowclick");
    if (this.props.onRowClick) {
      return this.props.onRowClick(event, rowData, this.state.colProps);
    } else {
      this.setState({
        selectedRowItem:rowData,
        showFormModal: true,
      });
    }
  }


  render() {
    const listItemFromRef = React.createRef<ListItemForm>();
    return (
      <div className="row" style={{margin:"0px"}}>
        { this.props.title && <span>{this.props.title}</span> }
        <Table striped hover size="sm">
          <ListHeader 
            colProps={this.state.colProps} 
            />
          <ListData 
            colProps={this.state.colProps}
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
                ref={listItemFromRef}
                rowData={this.state.selectedRowItem}
                colProps={this.state.colProps}
                onValidSubmit={this.handleFormModalSave}
                handleFormClose={this.handleFormModalClose}
              />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
