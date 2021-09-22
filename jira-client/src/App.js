import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Main from './container/Main';

const App = () => (
  <Router>
    <div>
      <Route path="/" component={ Main }/>
    </div>
  </Router>
)
export default App;
