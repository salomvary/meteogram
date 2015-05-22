import React from 'react'
import './search-results.css'

export default class SearchResults extends React.Component {
  render() {
		var results = this.props.results.map((result, i) => {
			return <li className="search-result" onClick={this.props.onClick.bind(null, i)}>{result.display_name}</li>
		})
		return (
			<ul className="search-results">
				{results}
			</ul>
		)
  }
}
