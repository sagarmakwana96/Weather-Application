import React from 'react';
import DayCard from'./DayCard';
import './WeatherContainer.css';
import { WiDaySunny, WiDayCloudy, WiDayShowers, WiDaySnow, WiDayHaze} from "weather-icons-react";
import Toggle from './Toggle.js';
import LineChart from 'react-linechart';
import '../node_modules/react-linechart/dist/styles.css';

function currentDate(){
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var currentDate = new Date();
    var date = days[currentDate.getDay()]+", "+currentDate.getDate()+" "+months[currentDate.getMonth()];
    return date;
} 


class WeatherContainer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dailyData: [],
            curData: [],
            fullData: [],
            country:null,
            city:null,
            temp:null,
            weatherType: null,
            weatherDescription:null,
            humidity:null,
            tempMin: null,
            tempMax: null,
            visibility: null,
            feelsLike: null,
            selectedOpt: null,
            degreeType: "imperial",
            dataPoint: []
        };
    }

    

    fetchCurWeather = (lat, long) => {
        var curWeather = 'http://localhost:8080/CurrentWeather/lat='+lat+'&long='+long+'&degreeType='+this.state.degreeType;
        fetch(curWeather)
        .then(res => res.json())
        .then(data => {
            this.setState({
            curData: data,
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            weatherType: data.weather[0].main,
            weatherDescription: data.weather[0].description,
            humidity: data.main.humidity,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            visibility: data.visibility,
            pressure: data.main.pressure,
            feelsLike: data.main.feels_like
            },)
        })
    }

    fetchWeather = (lat,long) => {
        var weatherURL = 'http://localhost:8080/WeatherForecast/lat='+lat+'&long='+long+'&degreeType='+this.state.degreeType;
        fetch(weatherURL)
        .then(res => res.json())
        .then(data => {
            const dailyData = data.list.filter(reading => reading.dt_txt.includes("18:00:00"))
            this.setState({
            fullData: data.list,
            dailyData: dailyData
            },() => this.updateChart(this.state.selectedOpt))
        })
        
    }


    weatherInit = () => {
        const success = (position) => {
          this.fetchCurWeather(position.coords.latitude, position.coords.longitude);
          this.fetchWeather(position.coords.latitude, position.coords.longitude);
        }
      
        const error = () => {
          alert('Unable to retrieve location.');
        }
      
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          alert('Your browser does not support location tracking, or permission is denied.');
        }
    }


    componentDidMount = () => {
        this.weatherInit();
    }

    updateForecastDegree = val => {
        this.setState({
          degreeType: val
        }, this.weatherInit())
    }
    

    getImage = () => {
        if(this.state.weatherType == 'Clear')
            return <WiDaySunny size={85} color='#ffe733'/>;
        else if(this.state.weatherType == 'Rain')
            return <WiDayShowers size={85} color='#ffe733'/>;
        else if(this.state.weatherType == 'Clouds')
            return <WiDayCloudy size={85} color='#ffe733'/>;
        else if(this.state.weatherType == 'Snow')
            return <WiDaySnow size={85} color='#ffe733'/>;
        else if(this.state.weatherType == 'Haze')
            return <WiDayHaze size={85} color='#ffe733'/>;   
    }



    updateChart = val => {
        var newPoint =[];
        var filterData=[];
        for(var i = 0; i < this.state.fullData.length; i ++){
            if(val == this.state.fullData[i].dt_txt.substring(0,10)){
                filterData.push(this.state.fullData[i]);
            }
        }
        var k = 0
        for(var i = 0; i < filterData.length ; i++){
            newPoint.push({x: k, y: filterData[i].main.temp});
            k +=3;
        }
        this.setState({
            selectedOpt: val,
            dataPoint : newPoint
        }, () => this.displayChart())
    }

    displayChart = () =>{
        
        var data = [
            {
                points: this.state.dataPoint,									
                color: "#1619c9",
            }
        ];

        return <LineChart 
            width={900}
            height={300}
            xLabel={"Hour(24-hour format)"}
            yLabel={this.state.degreeType === "metric" ? "Temperature °C" : "Temperature °F"}
            yMin={0}
            data={data}
            />
    }

    render() { 
        return (
            <div className="mainContainer">
                <div style = {{marginLeft: "44%", marginBottom:"15px"}}>
                    <Toggle degreeType={this.state.degreeType} updateForecastDegree={this.updateForecastDegree}/>
               </div>
                <div className="outerContainer">
                    <div className="container1">
                        <div className="location">
                            <h4>{this.state.curData.name}, {this.state.country}</h4>
                            <p>{currentDate()}</p>
                        </div>
                        <div className="weatherBlock">
                            <div className="weather">
                                {this.getImage()}
                                <p>{this.state.weatherDescription}</p>
                            </div>
                            <div className="temparature">
                                <span>{Math.floor(this.state.tempMax)}{this.state.degreeType === "metric" ? "°C" : "°F"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="container2">
                        <table className="reportTable">
                            <tr style={{width: "100%"}}>
                                <td>{this.state.humidity}%<br/>Humidity</td>
                                <td>{this.state.visibility}<br/>Visibility</td>
                                <td>{this.state.pressure} hPa<br/>Pressure</td>
                            </tr>
                            <br/>
                            <tr>
                                <td>{Math.floor(this.state.tempMax)}{this.state.degreeType === "metric" ? "°C" : "°F"}<br/>Max Temperature</td>
                                <td>{Math.floor(this.state.tempMin)} {this.state.degreeType === "metric" ? "°C" : "°F"}<br/>Min temperature</td>
                                <td>{Math.floor(this.state.feelsLike)} {this.state.degreeType === "metric" ? "°C" : "°F"}<br/>Feels Like</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div className="chartStyle" style={{marginLeft: "10%"}}>
                    {this.displayChart()}
                    <br/>
                </div>
            
              <div className="row justify-content-center">
                {this.state.dailyData.map(data =>( 
                    <>
                        <DayCard data={data} updateChart = {this.updateChart}/>
                    </>
                    ))
                }
              </div>
            </div>
        )
    }
}

export default WeatherContainer;