// import React from "react";

// function getWeatherIcon(wmoCode) {
//   const icons = new Map([
//     [[0], "☀️"],
//     [[1], "🌤"],
//     [[2], "⛅️"],
//     [[3], "☁️"],
//     [[45, 48], "🌫"],
//     [[51, 56, 61, 66, 80], "🌦"],
//     [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
//     [[71, 73, 75, 77, 85, 86], "🌨"],
//     [[95], "🌩"],
//     [[96, 99], "⛈"],
//   ]);
//   const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
//   if (!arr) return "NOT FOUND";
//   return icons.get(arr);
// }

// function convertToFlag(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

// function formatDay(dateStr) {
//   return new Intl.DateTimeFormat("en", {
//     weekday: "short",
//   }).format(new Date(dateStr));
// }

// class App extends React.Component {
//   //we can use class fields feature in which we can declare properties directly on a component instance, outside any method
//   //no this keyword as it will be placed on the component instance
//   // and since this keyword is also a component instance, then we dont need this anymore
//   state = {
//     location: "",
//     isLoading: false,
//     displayLocation: "",
//     weather: {},
//   };

//   //we can use arrow function as it doesnt have it own this keyword and it get acces to the surrounding one
//   fetchWeather = async () => {
//     if (this.state.location.length < 2) return this.setState({ weather: {} });
//     try {
//       this.setState({ isLoading: true }); //we can override it instead of making new object and destructure the old one
//       // 1) Getting location (geocoding)
//       const geoRes = await fetch(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
//       );
//       const geoData = await geoRes.json();
//       console.log(geoData);

//       if (!geoData.results) throw new Error("Location not found");

//       const { latitude, longitude, timezone, name, country_code } =
//         geoData.results.at(0);
//       this.setState({
//         displayLocation: `${name} ${convertToFlag(country_code)}`,
//       });

//       // 2) Getting actual weather
//       const weatherRes = await fetch(
//         `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
//       );
//       const weatherData = await weatherRes.json();
//       this.setState({ weather: weatherData.daily });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };

//   //child to parent communication
//   handleLocation = (e) => {
//     this.setState({ location: e.target.value });
//   };

//   //lifecylce methods are special methods that all react components get access to
//   //it also can run to use side effects at different points of the component lifecycle
//   //most important points of lifecylce are mouting redrendering and unmounting of the component
//   //its not as use effect but close to it
//   //1- componentDidMount called immediately after the dom has been created like use effect hook with empty dependency array []
//   componentDidMount() {
//     // this.fetchWeather();
//     this.setState({ location: localStorage.getItem("location") || "" }); //empty string for the first time
//   }

//   //2- componentDidUpdate react gives it acces to the previous state and props like use effect hook with some variables [...]
//   //this method only get called in rerender not in mount
//   componentDidUpdate(previousProps, previousState) {
//     if (this.state.location !== previousState.location) {
//       this.fetchWeather(); //this will make it rerender in each character we type in
//       localStorage.setItem("location", this.state.location);
//     }
//   }

//   render() {
//     return (
//       <div className="app">
//         <h1>Classy Weather</h1>
//         <InputField
//           location={this.state.location}
//           onChangeLocation={this.handleLocation}
//         />
//         {this.state.isLoading && <p className="loader">Loading...</p>}
//         {this.state.weather.weathercode && (
//           <Weather
//             weather={this.state.weather}
//             displayLocation={this.state.displayLocation}
//           />
//         )}
//       </div>
//     );
//   }
// }

// export default App;

// //child to parent communication
// class InputField extends React.Component {
//   render() {
//     return (
//       <div>
//         <input
//           type="text"
//           placeholder="Search For Location ..."
//           value={this.props.location}
//           onChange={this.props.onChangeLocation}
//         />
//       </div>
//     );
//   }
// }

// class Weather extends React.Component {
//   //3- componentWillUnmount similar to returing a cleanup function from effect function
//   //difference that this one runs after component unmounts, after it disappeared and destroyed, not between renders
//   componentWillUnmount() {
//     console.log("Unmounts");
//   }

//   render() {
//     //destructure props in each method manually
//     console.log(this.props);
//     const {
//       temperature_2m_min: min,
//       temperature_2m_max: max,
//       time: dates,
//       weathercode: codes,
//     } = this.props.weather;
//     return (
//       <div>
//         <h2>Weather {this.props.displayLocation}</h2>
//         <ul className="weather">
//           {dates.map((date, i) => (
//             <Day
//               date={date}
//               key={date}
//               max={max.at(i)}
//               min={min.at(i)}
//               code={codes.at(i)}
//               isToday={i === 0}
//             />
//           ))}
//         </ul>
//       </div>
//     );
//   }
// }

// class Day extends React.Component {
//   render() {
//     const { date, max, min, code, isToday } = this.props;
//     return (
//       <li className="day">
//         <span>{getWeatherIcon(code)}</span>
//         <p>{isToday ? "Today" : formatDay(date)}</p>
//         <p>
//           {Math.floor(min)}&deg; &mdash;<strong>{Math.ceil(max)} &deg;</strong>
//         </p>
//       </li>
//     );
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        {/* <Footer /> */}
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
