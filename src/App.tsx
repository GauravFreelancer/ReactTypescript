import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import User from './components/User/User';
import ManageUser from './components/User/ManageUser';

interface Props {

}

const App: React.FC<Props> = () => {
  return (
    <BrowserRouter>
      <div className="App">
          <Route path="/" exact component={User}></Route>
          <Switch>
            <Route path="/manage-user/:userId" component={ManageUser}></Route>
            <Route path="/manage-user" component={ManageUser}></Route>
          </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
