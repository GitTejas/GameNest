import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameList from "./GamesList";
import GameForm from './GameForm';


function App() {
  return (
    <Router>
      <div className="App">
        <h1>Game Collection</h1>
        <Switch>
          <Route exact path="/">
            <GameList />
          </Route>
          <Route path="/add-game">
            <GameForm />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
