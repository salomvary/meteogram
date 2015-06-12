import React from 'react'

export default class Meteogram extends React.Component {
  render() {
    var id = formatCoordinates(this.props.lat, this.props.lon)
    var src = `http://www.wetterzentrale.de/pics/MS_${id}_g05.png`
    return (
      <p>
        <img src={src}/>
      </p>
    )
  }
}

function formatCoordinates(lat, lon) {
  return format(lon) + format(lat)
}

function roundToHalf(num) {
  return Math.round(num * 2) / 2
}

function format(num) {
  num = roundToHalf(num)
  return String(Math.round(num * 10))
}
