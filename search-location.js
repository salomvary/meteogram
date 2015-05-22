import React from 'react/addons'
import SearchResults from './search-results'
import search from './search-api'
import debounce from 'debounce'
import './search-location.css'

export default class SearchLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      inputValue: null,
      location: null,
      locations: [],
      errorMessage: null
    }
    this.suggest = debounce(this.suggest.bind(this), 1000)
  }

  handleSubmit(e) {
    e.preventDefault()
    var query = this.state.inputValue;
    if (query) {
      this.search(query)
    }
  }

  handleReset() {
    this.reset()
  }

  handleInput(event) {
    var value = event.target.value.trim()
    this.setState({
      inputValue: value
    })
    if (value) {
      this.suggest(value)
    } else {
      this.reset()
    }
  }

  handleSelectResult(i) {
    var location = this.state.locations[i]
    this.setState({
      location: location,
      inputValue: location.display_name,
      locations: []
    })
    this.props.onLocationChange(location)
  }

  reset() {
    this.setState({
      inputValue: null,
      location: null,
      locations: [],
      errorMessage: null
    })
    this.props.onLocationChange(null)
  }

  suggest(query) {
    search(query)
      .then((locations) => {
        this.setState({locations: locations, errorMessage: null})
      })
      .catch((e) => {
        this.setState({locations: [], errorMessage: 'Failed to search :('})
      })
  }

  search(query) {
    this.setState({locations: []})
    search(query)
      .then((locations) => {
        if (locations.length) {
          var result = locations[0]
          this.setState({
            inputValue: result.display_name,
            location: result
          })
          this.props.onLocationChange(result)
        } else {
          this.setState({
            errorMessage: 'Can not find "' + query + '" :('
          })
        }
      })
      .catch(() => {
        this.setState({
          errorMessage: 'Search failed :('
        })
      })
  }

  render() {
    var className = 'search-location'
    var locations
    if (this.state.locations.length) {
      className += ' has-results'
      locations = <SearchResults results={this.state.locations} onClick={this.handleSelectResult.bind(this)}/>
    } else if(this.state.errorMessage) {
      locations = <p>{this.state.errorMessage}</p>
    }
    var reset
    if (this.state.inputValue) {
      reset = <button className="button search-location-reset" type="reset">✕</button>
    }
    return (
      <div className={className}>
        <form onSubmit={this.handleSubmit.bind(this)} onReset={this.handleReset.bind(this)}>
          <span className="search-location-input-wrapper">
            <input className="input search-location-input" type="text" ref="query" onInput={this.handleInput.bind(this)}
              value={this.state.inputValue}/>
            {locations}
            {reset}
          </span>
          <button className="button" type="submit">Search</button>
        </form>
      </div>
    )
  }
}
