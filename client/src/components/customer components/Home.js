import React, { Component } from 'react';
import CallCard from './CallCard';
import './customer.css';
import { Input, Button } from '@bandwidth/shared-components';

class Home extends Component{
    state = {
        callActive: false
    }

    callClicked = () => {
        this.setState({callActive : !this.state.callActive});
    }

    renderCallCard = () =>{
        if(this.state.callActive){
            return(
                <CallCard />
            )
        }
    }
    render(){
        return(
            <div>
                <div className="landing">
                    <div className="call-floater">
                        <Button onClick={() => this.callClicked()} >
                            Call Us
                        </Button>
                        {this.renderCallCard()}
                    </div>
                    <div className="form-div">
                        <h1>Find Your Castle.</h1>
                        <label htmlFor="location">WHERE</label>
                        <Input name="location" type="text" placeholder="Location" />

                        
                        <label htmlFor="checkin">Check-In</label>
                        <Input name="checkin" type="date" />

                        <label htmlFor="checkout">Check-Out</label>
                        <Input name="checkout" type="date" />
                        
                        <label htmlFor="guests">Guests</label>
                        <Input type="number" name="guests" placeholder="# of Bouncers" />
                        <a href="/listings" ><Button>Search</Button></a>
                        
                    </div>
                    <div className="footer-landing">
                        <div className="footer-container-landing">
                        <p className="no-margin">Copyright 2019</p>
                        <p className="no-margin">Made with <span role="img" aria-label="heart emoji">❤️</span> by Bandwidth</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;