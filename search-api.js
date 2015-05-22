import 'whatwg-fetch'
import cancelify from './cancelify.js'

export default function(query) {
  if (ongoingSearch) {
    ongoingSearch.cancel()
  }
  ongoingSearch = cancelify(search(query))
  return ongoingSearch
}

var ongoingSearch

function search(query) {
  var baseUrl = 'http://open.mapquestapi.com/nominatim/v1/search.php'
  var params = {
    addressdetails: 1,
    format: 'json',
    limit: 15,
    q: query
  }
  var url = baseUrl + '?' + encodeParams(params)
  return fetch(url).then(response => response.json())
}

function encodeParams(params) {
  return Object.keys(params)
    .reduce(function(entries, key) {
      entries.push(key + '=' + encodeURIComponent(params[key]))
      return entries
    }, [])
    .join('&')
}
