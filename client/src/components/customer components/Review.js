import React from 'react';
import { motion } from 'framer-motion';


const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const Review = ( props ) => {
    return(
        <motion.div  variants={item} className="review-container">
            <img alt="reviewer profile pic" src={props.img} className="review-profile-pic" />
            <div className="review-text">
                <h4 className="no-margin">{props.guest}</h4>
                <p className="no-margin">{props.comment}</p>
            </div>
        </motion.div>
    )
}

export default Review;