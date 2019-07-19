import React from 'react';

const Listing = ( props ) => {
    return(
        <div className="listing-card">
            <img alt="listing of bouncy castle" className="listing-image" src={props.image} />
            <div className="listing-desc">
                <h4>{props.title}</h4>
                <p>${props.price}</p>
                <a className="book-button" href="/customer">Book Now</a>
            </div>
        </div>
    )
}

export default Listing;