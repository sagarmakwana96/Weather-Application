
import React from 'react';

const Toggle = ({degreeType, updateForecastDegree} ) => {
  return (
    <React.Fragment>
    <div className="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="degree-type" id="celsius" value="metric" checked={degreeType === "metric"} onChange={event => updateForecastDegree(event.target.value)}/>
        <label class="form-check-label" for="celsius">Celsius</label>
    </div>
      <div className="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="degree-type" id="farenheit" value="imperial" checked={degreeType === "imperial"} onChange={event => updateForecastDegree(event.target.value)}/>
        <label class="form-check-label" for="farenheit">Farenheit</label>
    </div>
    </React.Fragment>
  )
}

export default Toggle;