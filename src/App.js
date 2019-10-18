import React from 'react';
import './App.css';
import SendReq from './SendReq';
import { Route, /*NavLink,*/ Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      {/* <header>
        <nav>
          <ul>
            <li>
              <NavLink to={{pathname: '/sendReq'}}>Send Request</NavLink>
            </li>
          </ul>
        </nav>
      </header> */}
      <Switch> 
        {/* <Route path='/' exact render={() => <h1>Lep pozdrav</h1>} /> */}
        {/* <Route path='/sendReq' exact component={SendReq} />            */}
        <Route path='/' exact component={SendReq} />
      </Switch>    
    </div>
    </BrowserRouter>
  );
}

// const App = () => {
//   return (
//     <div className="App">
//       <SendReq />
//     </div>
//   );
// }

export default App;
