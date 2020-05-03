import React from 'react';
import ReactDOM from 'react-dom';
import { JoinPage } from './JoinPage';
//import * as serviceWorker from './serviceWorker';

declare var joinProps: any;

ReactDOM.render(
  <React.StrictMode>
    <JoinPage {...joinProps} />
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
