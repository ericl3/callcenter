import React from 'react';
import Listing from './Listing';
import Footer from './Footer';

const ListingPage = () => {

    var listingsOne = [
        {
            image: "./test.png",
            title: "Insane Bouncy Castle",
            price: 12
        },
        {
            image: "./home2.png",
            title: "Pretty Decent Bouncy Castle",
            price: 8
        },
        {
            image: "./home8.png",
            title: "Quiet Bouncy Castle Overlooking Calm Lake",
            price: 43
        },
        {
            image: "./home7.png",
            title: "Peak State Bouncy Castle",
            price: 11000
        },
        {
            image: "./home4.png",
            title: "Pollination Nation",
            price: 2
        }
        
    ]

    var listingsTwo = [
        {
            image: "./home9.png",
            title: "Lighthouse in stormy conditions Bouncy Castle",
            price: 90
        },
        {
            image: "./home5.png",
            title: "Spiritual Bouncy Castle in Mountains",
            price: 12
        },
        {
            image: "./home10.png",
            title: "Floating Home Bouncy Castle",
            price: 93
        },
        {
            image: "./home11.png",
            title: "Oasis Bouncy Castle",
            price: 42
        },
        {
            image: "./home12.png",
            title: "A Stroll Down Memory Lane with a Great Bouncy Castle",
            price: 93
        }
    ]

    function renderListingsOne(){
        const allListings = listingsOne.map( listing => {
            return(
                <Listing
                    image = {listing.image}
                    title = {listing.title}
                    price = {listing.price}
                />
            );
        });
        return allListings;
    }
    function renderListingsTwo(){
        const allListings = listingsTwo.map( listing => {
            return(
                <Listing
                    image = {listing.image}
                    title = {listing.title}
                    price = {listing.price}
                />
            );
        });
        return allListings;
    }
    return(
        <div className="listing-bg">
            <div className="center-me">
                <div className="three-row">
                    {renderListingsOne()}
                </div>
                <div className="three-row">
                    {renderListingsTwo()}
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default ListingPage;