import React from 'react'
import SearchLocation from './search-location'
import Meteogram from './meteogram'
import './app.css'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: null,
      lon: null
    }
  }

  onLocationChange(location) {
    this.setState({
      lat: location && location.lat,
      lon: location && location.lon
    })
  }

  render() {
    if (this.state.lat) {
      var meteogram = <Meteogram lat={this.state.lat} lon={this.state.lon}/>
    }
    return (
      <div>
        <SearchLocation onLocationChange={this.onLocationChange.bind(this)}/>
        {meteogram}
      </div>
    )
  }
}

export default App
