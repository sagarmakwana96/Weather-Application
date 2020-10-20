import React from 'react';
import { WiDaySunny, WiDayCloudy, WiDayShowers, WiDaySnow} from "weather-icons-react";
import './DayCard.css';

function getImage(type){
  if(type == 'Clear')
      return <WiDaySunny size={80} color='#ffe733'/>;
  else if(type == 'Rain')
      return <WiDayShowers size={80} color='#ffe733'/>;
  else if(type == 'Clouds')
      return <WiDayCloudy size={80} color='#ffe733'/>;
  else if(type == 'Snow')
      return <WiDaySnow size={80} color='#ffe733'/>;
}

const DayCard = ({ data,degreeType, updateChart}) => {
  var date = new Date();
  var day = data.dt * 1000
  date.setTime(day)
  console.log(degreeType);
  var flag = false;
  
  return (
    <div>
    <label className="button" for={data.dt_txt.substring(0,10)}>
    <input  type="radio" name="date" id={data.dt_txt.substring(0,10)} value={data.dt_txt.substring(0,10)} onChange={event => updateChart(event.target.value)}/>
    <div className="col-sm-2">
      <div className="weatherCard">
        <h6 className="card-title">{date.toString().split(' ')[0]}</h6>
        {getImage(data.weather[0].main)}
        <p>{ Math.floor(data.main.temp)}°</p>
        <p className="card-text">{data.weather[0].description}</p>
      </div>
    </div>
    </label>
    </div>
  )
}

export default DayCard;