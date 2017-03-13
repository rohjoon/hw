/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  Text,
  View, 
  Image, 
  TouchableNativeFeedback
} from 'react-native';

exports.framework = 'React';
exports.title = 'Weather';
exports.description = 'CS442 Proj1. Displaying weather infomation';

var baseurl = "http://api.wunderground.com/api/a9a62b200e5ec752/";
// http://api.wunderground.com/api/cf2f35b0c17a9ca3/geolookup/q/36.368982,127.363029.json
export default class AwesomeProject extends Component {

  sendRequest(url, succeddedFunc) 
  {
      var request = new XMLHttpRequest();
      request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        succeddedFunc(request.responseText);
      } else {
          console.error(e);
      }
    };

    request.open('GET', url);
    request.send();
  }

  _setDecimal = (num)=>(Math.ceil(num) == num ? num + ".0" : num);
  _getJsonStr = (lat, lon) => ( this._setDecimal(lat) + "," + this._setDecimal(lon) + ".json");

  getCurrentWeather(lat, lon) {
    var url = baseurl + "conditions/q/" + this._getJsonStr(lat, lon);
    this.sendRequest(url, (responseText)=>{
      var currentWeather = JSON.parse(responseText).current_observation;
      this.setState({currentWeather});
    });    
  }
  getForecast(lat, lon) {
    var url = baseurl + "forecast/q/" + this._getJsonStr(lat, lon);
    this.sendRequest(url, (responseText)=>{
      var forecast = JSON.parse(responseText).forecast;
      this.setState({forecast});
    });
  }

  fetchHourlyWeather = (lat, lon) => 
  {
    var url = baseurl + "hourly/q/" + this._getJsonStr(lat, lon);
    this.sendRequest(url, (responseText)=>{
      var hourlyForecast = JSON.parse(responseText).hourly_forecast;
      this.setState({hourlyForecast});
    });
  };

  refreshWeatherInfo = (lat, lon) =>
  {
    this.getCurrentWeather(lat, lon);
    this.getForecast(lat, lon);
    this.fetchHourlyWeather(lat, lon);
  };

  refreshGeoInfo = () =>
  {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.refreshWeatherInfo(position.coords.latitude, position.coords.longitude);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.refreshWeatherInfo(position.coords.latitude, position.coords.longitude);
    });
  };

  refresh = () =>
  {
    this.refreshGeoInfo();
  };

  componentDidMount() {
    this.refresh();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  setTitleText = (text) => { this.titleTxt = text };
  
  renderCurrentWeather()
  {
    if (this.state == null ||  this.state.currentWeather == null)
    {
      return (
        <Text style={styles.title}>
        " Cannot fetch Geo Infomation "
       </Text>
       );
    }

    var rainPosiblilty = this.state.hourlyForecast != null ? this.state.hourlyForecast[0].pop + "% chance of rain" : "No Rain Data";
    var maxMinTmp = this.state.forecast != null ? this.state.forecast.simpleforecast.forecastday[0].high.celsius + "°C /" + this.state.forecast.simpleforecast.forecastday[0].low.celsius + "°C": "";

    return (
      <View>
        <Text style={styles.title}>
          { this.state.currentWeather.display_location.city }
        </Text>
        <Text style={styles.currentWeather}>
          { this.state.currentWeather.temp_c + "°C /  " + this.state.currentWeather.weather}
        </Text>
        <Image source={{uri:this.state.currentWeather.icon_url}} 
                style={{width: 40, height: 40}} />
        <Text>
         { "Temperature : " +  maxMinTmp }
        </Text>
        <Text>
         { rainPosiblilty }
        </Text>

      </View>
    );
  }


  _render3DayForecast = (json) => (
      <View style={styles.dayItem} >
      <Text> { json.date.weekday } </Text>
      <Image source={{uri:json.icon_url}} 
        style={{width: 40, height: 40}} />
      <Text> { json.high.celsius + "°C /" + json.low.celsius + "°C" } </Text>
      <Text> { json.pop + "%" } </Text>
      </View>
    );
  
  render3DayForecast = () => {
    if (this.state == null ||  this.state.forecast == null)
    {
      return (
        <Text style={styles.title}>
        " No forecast data "
        </Text>
      );
    }
    
    return (
      <View style={styles._3DayContainer}>
        { this.state.forecast.simpleforecast.forecastday.slice(1).map(this._render3DayForecast) }
      </View>
    );
  };

  _renderHourlyForecast = (json) => (
      <View style={styles.hourlyItem}>
      <Text> { json.FCTTIME.hour_padded } </Text>
      <Image source={{uri:json.icon_url}} 
        style={{width: 40, height: 40}} />
      <Text> { json.temp.metric + "°C" } </Text>
      <Text> { json.pop + "%" } </Text>
      </View>
    );

  renderHourlyForecast = () => {
    if (this.state == null ||  this.state.hourlyForecast == null)
    {
      return (
        <Text style={styles.title}>
        " No hourly forecast data "
        </Text>
      );
    }
    return (
      <View style={styles._hourlyContainer}>
        { this.state.hourlyForecast.slice(0, 5).map(this._renderHourlyForecast) }
      </View>
    );
  };

  renderRefreshButton = () =>
  (
      <TouchableNativeFeedback
          onPress={this.refresh}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <Image 
                  style={styles.button}
                  source={require('./img/refresh.png')} 
                  style={{width: 20, height: 20}} />
      </TouchableNativeFeedback>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 3}}>
        { this.renderRefreshButton() }
        { this.renderCurrentWeather() }      
        </View>
        <View style={{flex: 3}}>
        { this.render3DayForecast() }
        </View>
        <View style={{flex: 2}}>
        { this.renderHourlyForecast() }
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  subcontainer: {
    flex: 1, 
    flexDirection: 'row'
  }, 
  _3DayContainer :{
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent:'space-between',
  },
  dayItem : {
    width: 100,
    alignItems: 'center',
  },
  _hourlyContainer:{
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent:'space-between',
  },
  hourlyItem  :{
    width: 70,
    alignItems: 'center',
  }, 
  title: {
    fontSize: 40,
    textAlign: 'left',
    margin: 10,

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

