import React from 'react';
import { Button } from '@bandwidth/shared-components';
const Listing = ( props ) => {
    return(
        <div className="listing-card">
            <img alt="listing of bouncy castle" className="listing-image" src={props.image} />
            <div className="listing-desc">
                <h4>{props.title}</h4>
                <p>${props.price}</p>
                <a href="/customer"><Button>Book Now</Button></a>
            </div>
        </div>
    )
}

export default Listing;