import React, { Component } from 'react';
import BandwidthProvider from '@bandwidth/shared-components'
import App from './App'

class Root extends Component {
    render() {
        return (
            <BandwidthProvider>
                <App />
            </BandwidthProvider>
        )
    }
}

export default Root