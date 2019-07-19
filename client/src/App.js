import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Customer from "./components/layout/Customer"
import CustomerService from "./components/layout/CustomerService"
import Manager from "./components/layout/Manager"
import { BandwidthProvider } from '@bandwidth/shared-components'
import './App.css';

class App extends Component {
  render() {
    return (
      <BandwidthProvider>
        <Router>
          <div className="App">
            <Route exact path="/customer" component={Customer} />
            <Route exact path="/customer-service" component={CustomerService} />
            <Route exact path="/manager" component={Manager} />
          </div>
        </Router>
      </BandwidthProvider>
    )
  }
}

export default App;
