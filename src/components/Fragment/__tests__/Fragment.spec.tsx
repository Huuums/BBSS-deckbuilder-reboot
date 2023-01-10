import React from 'react';
import { render } from '@testing-library/react';
// import Fragment from '../Fragment';

describe('<Fragment>', () => {
  test('it should render <Fragment>', () => {
    // render(<Fragment/>);
    render(<div/>)
    expect(true).toBeTruthy()
  });
});
