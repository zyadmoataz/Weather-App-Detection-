import React from "react";
// import Footer from "./Footer";
import Head from "./Head";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component {
  state = {
    location: "Cairo",
    isLoading: false,
    displayLocation: "",
    weather: {},
  };

  fetchWeather = async () => {
    if (this.state.location.length < 2) return this.setState({ weather: {} });
    try {
      this.setState({ isLoading: true });
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results[0];
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleLocation = (e) => {
    this.setState({ location: e.target.value });
  };

  componentDidMount() {
    this.setState({ location: localStorage.getItem("location") || "" });
  }

  componentDidUpdate(previousProps, previousState) {
    if (this.state.location !== previousState.location) {
      this.fetchWeather();
      localStorage.setItem("location", this.state.location);
    }
  }

  render() {
    return (
      <div className='app'>
        <Head />
        <main>
          <h1>Type Your City And Check The Weather Of The Week</h1>
          <InputField
            location={this.state.location}
            onChangeLocation={this.handleLocation}
          />
          {this.state.isLoading && <p className='loader'>Loading...</p>}
          {this.state.weather.weathercode && (
            <Weather
              weather={this.state.weather}
              displayLocation={this.state.displayLocation}
            />
          )}
        </main>
      </div>
    );
  }
}

export default App;

class InputField extends React.Component {
  render() {
    return (
      <div>
        <input
          type='text'
          placeholder='Search For Location ...'
          value={this.props.location}
          onChange={this.props.onChangeLocation}
        />
      </div>
    );
  }
}

class Weather extends React.Component {
  componentWillUnmount() {
    console.log("Unmounts");
  }

  render() {
    const {
      temperature_2m_min: min,
      temperature_2m_max: max,
      time: dates,
      weathercode: codes,
    } = this.props.weather;
    return (
      <div>
        <h2>Weather Of {this.props.displayLocation}</h2>
        <ul className='weather'>
          {dates.map((date, i) => (
            <Day
              date={date}
              key={date}
              max={max[i]}
              min={min[i]}
              code={codes[i]}
              isToday={i === 0}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;
    return (
      <li className='day'>
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)} &deg;</strong>
        </p>
      </li>
    );
  }
}
