import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { configureFakeBackend } from './helpers';
import { httpInterceptor } from './helpers/util';

httpInterceptor()
// configureFakeBackend()

ReactDOM.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
  ,
  document.getElementById('root')
);