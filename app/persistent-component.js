import React from 'react'

const prefix = 'meteogram-'

export default class PersistentComponent extends React.Component {
  getPersistedState() {
    var initialState = this.getInitialState()
    var storageState = getStorage.call(this)
    return Object.assign(initialState, storageState)
  }

  onLocationChange(location) {
    this.setState({
      lat: location && location.lat,
      lon: location && location.lon
    })
  }

  componentDidUpdate() {
    setStorage.call(this, this.state)
  }
}

function setStorage(value) {
  localStorage[prefix + this.constructor.name] = JSON.stringify(value)
}

function getStorage() {
  var key = prefix + this.constructor.name
  if (localStorage[key]) {
    try {
      return JSON.parse(localStorage[key])
    } catch(e) { }
  }
}
