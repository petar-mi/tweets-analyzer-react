import React from 'react';
import './App.css';
import SendReq from './SendReq';
import { Route, /*NavLink,*/ Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Switch> 
        <Route path='/' exact component={SendReq} />
      </Switch>    
    </div>
    </BrowserRouter>
  );
}

export default App;
