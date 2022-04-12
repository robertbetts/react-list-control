import * as React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ListControl from "../src/components/ListControl";
import { clientDataRows, colProps } from "../src/reference/FakeSampleData";


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', () => {
  render(<ListControl 
    title='Test List Control'
    colProps={colProps}
    data={clientDataRows()}
    />, container);
});

it ("Open form when row onclick", () => {

  const list_control = render(<ListControl 
    title='Test List Control'
    colProps={colProps}
    data={clientDataRows()}
    />, container);
  
  let table_row = document.querySelector("tr");
  // console.log(table_row);
  act(() => {
    table_row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const close_button = document.querySelector("button.btn-secondary");
  act(() => {
    table_row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  table_row = document.querySelector("tr");
  // console.log(table_row);
  act(() => {
    table_row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const save_button = document.querySelector("button.btn-primart");
  act(() => {
    table_row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });


})