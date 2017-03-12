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

var apiKey = "6d6da3a3b783f7e4f2b9cb9fa9d6752c";

export default class AwesomeProject extends Component {
   getCurrentWeather(lat, lon) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon;

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var currentWeather = JSON.parse(request.responseText);
        this.setState({currentWeather});
        // console.log('success', request.responseText);
      } else {
        // console.warn('error');
          console.error(error);
      }
    };

    request.open('GET', url);
    request.send();
  }

   getFutureWeather(lat, lon) {
    var url = 'http://api.openweathermap.org/data/2.5/forecast?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon;
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var futureWeather = JSON.parse(request.responseText);
        this.setState({futureWeather});
      } else {
        // console.warn('error');
          console.error(error);
      }
    };

    request.open('GET', url);
    request.send();
  }

  refreshWeatherInfo = (lat, lon) =>
  {
    this.getCurrentWeather(lat, lon);
    this.getFutureWeather(lat, lon);
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
      alert ("lat : " + position.coords.latitude + ", long : " + position.coords.longitude);
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
  getTitle()
  {
    return (       
     <Text style={styles.title}>
      { this.state && this.state.currentWeather != null ?  this.state.currentWeather.name : "Welcome"}
     </Text>
    );
  }

  getBody()
  {
    return (
          <Text style={styles.instructions}>
            To get started, edit index.android.js
          </Text>
          );
  }

  renderButton = () =>
  (
      <TouchableNativeFeedback
          onPress={this.refresh}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <Image 
                  style={styles.button}
                  source={require('./img/refresh.png')} 
                  style={{width: 40, height: 40}} />
      </TouchableNativeFeedback>
  );


  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 3}}>
        { this.renderButton() }
        { this.getTitle() }        
        { this.getBody()  }
        </View>
        <View style={{flex: 3}}>
        </View>
        <View style={{flex: 2}}>
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

