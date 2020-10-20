package com.weather.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@RestController
public class Controller {

    @Autowired
    RestTemplate restTemplate;

    @Value("${app.id}")
    String appId;

    @GetMapping("/CurrentWeather/lat={lat}&long={long}&degreeType={degreeType}")
    public ResponseEntity<String> getWeatherData(@PathVariable("lat") String lat, @PathVariable("long") String longitude,
                                                 @PathVariable("degreeType") String degreeType) {
        String url = "http://api.openweathermap.org/data/2.5/weather?units="+degreeType+
                "&lat="+lat+"&lon="+longitude+"&appid="+appId;
//        System.out.println("URL " + url);
        ResponseEntity<String> response
                = restTemplate.getForEntity(url, String.class);
        return response;
    }

    @GetMapping("/WeatherForecast/lat={lat}&long={long}&degreeType={degreeType}")
    public ResponseEntity<String> getWeatherForecast(@PathVariable("lat") String lat, @PathVariable("long") String longitude,
                                                 @PathVariable("degreeType") String degreeType) {
        String url = "http://api.openweathermap.org/data/2.5/forecast?units="+degreeType+
                "&lat="+lat+"&lon="+longitude+"&appid="+appId;
        System.out.println("URL " + url);
        ResponseEntity<String> response
                = restTemplate.getForEntity(url, String.class);
        return response;
    }
}
