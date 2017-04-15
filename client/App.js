/**
 * Root Component
 */
import React from 'react';
import { Router, browserHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import routes from './routes';

export default function App() {
  return (
    <Router history={browserHistory}>
      {routes}
    </Router>
  );
}
