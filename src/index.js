import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import makeStore from './store';
import './index.css';

export const store = makeStore();

store.dispatch({
  type: 'SET_ACTIVE_PERSON',
  person: {
    id: 123,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Orchid_high_resolution.jpg/320px-Orchid_high_resolution.jpg",
    first_name: "Orchid"
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
