import * as React from 'react';
import { render, unmountComponentAtNode } from "react-dom";

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

