import * as React from 'react';
import {render, screen} from '@testing-library/react'
import App from '../src/App.js';
import {fetchTableData} from '../src/App.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
});

// sanity check
it('one is one', () => {
  expect(1).toEqual(1)
});


test(" fetchTableData with no parameters", () => {
  const result = fetchTableData();
  expect(result.count).toEqual(result.data.length)
})

test(" fetchTableData with parameters", () => {
  const result = fetchTableData("ClientDB", "client");
  expect(result.count).toEqual(result.data.length)
  expect(result.count).toEqual(20)
})


// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
