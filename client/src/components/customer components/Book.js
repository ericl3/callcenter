import React, { Component } from 'react';
import Review from './Review';
import Footer from './Footer';
import home from "./home2.png";
import CallCard from './CallCard';
import Customer from '../layout/Customer';
import { Button } from '@bandwidth/shared-components'
import { motion } from 'framer-motion';


const stagger = {
    hidden: {opacity: 1, scale: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.3,
            when: "beforeChildren",
            staggerChildren: .5
        }
    }
}

const centerVariants = {
    hidden: {opacity: 1, scale: 0},
    visible:{
        opacity: 1,
        scale: 1,
        transition:{
            delay: 2
        }
    }
}

class Book extends Component{
    render(){
        return(
            <div>
                <div className="book">
                    <div className="book-container">
                        <div className="book-info-column">
                            <img className="book-photo" alt="example home" src={home} />
                            <h2 className="no-margin">Pretty Decent Bouncy Castle</h2>
                            <p className="no-margin lighter">Available for your dates.</p>
                            <p className="no-margin">Neslted in the valleys of Europe, this bouncy castle features at least 4 colors, 1 pump, and hours of fun. 
                                Adults of all ages (mostly the younger ones, though) 
                                will enjoy their time bouncing, sleeping, and maybe eating.</p>
                            <br></br>
                            <br/>
                        </div>
                        <div className="book-main-column">
                            
                            <h4 className="no-margin lighter">Hosted By</h4>
                            <h4 className="no-margin">Carolyn Woodward, <span className="lighter">4.0 ★★★★</span></h4>
                            <p className="italics">Carolyn grew up all over the western countryside, but her fondest childhood memories come from her time spent in the Maine L.L. Bean Store.</p>

                            <div className="flex-row">
                                <motion.div className="reviews">
                                    <h2 className="lighter">Reviews</h2>
                                    <motion.div variants={stagger} initial="hidden" animate="visible">
                                        <Review img="https://randomuser.me/api/portraits/lego/6.jpg" guest="Jacob Smithers" comment="I enjoyed my time in this bouncy castle. Breakfast was lacking, but to quote my mother, 'Guests can't be choosy.'"  />
                                        <Review img="https://randomuser.me/api/portraits/lego/8.jpg" guest="Jonah Goldwater" comment="Hearing about Carolyn's time in the Maine L.L. Bean store was incredible" />
                                        <Review img="https://randomuser.me/api/portraits/lego/2.jpg" guest="Jeffrey Jeffries" comment="I'll be honest, it was not the best bouncy castle. Nice area, though." />
                                    </motion.div>
                                </motion.div>
                            
                                <div className="call-area">
                                    <h2 className=" lighter">Call Center</h2>
                                    <motion.div variants={centerVariants} initial="hidden" animate="visible" delay={1.5}>
                                        <CallCard />
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Book;