import React from 'react'
import axios from 'axios'
import ShowWeather from './ShowWeather'
import Loader from './Loader'

class App extends React.Component {
  state = { coords: null, errMsg: '', weatherData: {} }

  getWeatherData = async (coords) => {
    const { lat, lon } = coords

    try {
      const weatherData = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: 'ef4f042757a2a7a055c0f4015d1031b0',
          },
        }
      )
      this.setState({ weatherData })
    } catch {
      console.log('error')
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        this.setState({
          coords: { lat: res.coords.latitude, lon: res.coords.longitude },
        })

        this.getWeatherData(this.state.coords)
      },
      (err) => {
        this.setState({ errMsg: err.message })
      }
    )
  }

  renderContent() {
    if (this.state.errMsg && !this.state.coords) {
      return <div>Error: {this.state.errMsg}</div>
    }

    if (!this.state.errMsg && this.state.coords) {
      if (this.state.weatherData.status === 200) {
        return (
          <div>
            <ShowWeather data={this.state.weatherData} />
          </div>
        )
      }
      return <div>Error: {this.state.errMsg}</div>
    }

    return <Loader message="Please accept location request" />
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}

export default App
