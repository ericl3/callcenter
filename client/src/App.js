import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Customer from "./components/layout/Customer"
import CustomerService from "./components/layout/CustomerService"
import Manager from "./components/layout/Manager"
import { BandwidthProvider } from '@bandwidth/shared-components'
import './App.css';

import Home from './components/customer components/Home';
import ListingPage from './components/customer components/ListingPage';
import Book from './components/customer components/Book';
import Rep from './components/rep components/Rep';

class App extends Component {
  render() {
    return (
      <BandwidthProvider>
        <Router>
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route exact path="/listings" component={ListingPage} />
            <Route exact path="/customer" component={Book} />
            <Route exact path="/customer-service" component={Rep} />
            <Route exact path="/manager" component={Manager} />
          </div>
        </Router>
      </BandwidthProvider>
    )
  }
}

export default App;
