import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Main from './container/Main';

const App = () => {
  console.log('NODE_ENV', process.env.NODE_ENV)
  return (
  <Router>
    <div>
      <Route path="/" component={ Main }/>
    </div>
  </Router>
)}
export default App;
