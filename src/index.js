import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';

import initialState from './store'
import App from './App';

ReactDOM.render(
  <Provider store={initialState}>
    <div className="App"><App/></div>
  </Provider>,
  document.getElementById('root')
);