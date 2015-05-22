import React from 'react'
import SearchLocation from './search-location.js'
import './app.css'

class App extends React.Component {
  render() {
		return <SearchLocation onLocationChange={console.log.bind(console)}/>
  }
}

export default App
