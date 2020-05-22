import React from 'react';
import ReactDOM from 'react-dom';
import { TablePage } from './TablePage';
import { AppContext } from './AppContext';
//import * as serviceWorker from './serviceWorker';

declare var tableProps: any;
declare var deckType: any;
const getDeck = (d: string) => {
  switch (d) {
    case "fib":
      return ["0", "1", "2", "3", "5", "8"];
    case "half":
      return ["0.5", "1", "1.5", "2", "2.5", "3"];
    default:
      return ["0", "1", "2", "3", "4", "5"];
  }
}
const deck = getDeck(String(deckType));

ReactDOM.render(
  <React.StrictMode>
    <AppContext.Provider value={{ deck: deck }}>
      <TablePage {...tableProps} />
    </AppContext.Provider>
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
