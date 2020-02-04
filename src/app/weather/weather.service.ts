import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Weather } from '../core/shared/interfaces/weather';
import { WeatherData } from '../core/shared/interfaces/weather-data';

@Injectable({
 providedIn: 'root'
})
export class WeatherService {
  private URL = 'api.openweathermap.org/data/2.5/weather?q=';
  private KEY = 'f20731d3502ea8309db4096a482f50d2';
  private IMP = '&units=metric';

 constructor(private http: HttpClient) { }

 searchWeatherData(cityName: string): Observable<Weather> {
   return this
            .http
            .get<WeatherData>(`${this.URL}${cityName}&APPID=${this.KEY}${this.IMP}`)
            .pipe(
              map(data => this.transformWeatherData(data)),
              tap(data => console.log(JSON.stringify(data))),
              catchError(this.handleError)
            );
 }

 private transformWeatherData(data: WeatherData): Weather {
   return {
    name: data.name,
    country: data.sys.country,
    image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    description: data.weather[0].description,
    temperature: data.main.temp,
    lat: data.coord.lat,
    lon: data.coord.lon
   };
 }

 private handleError(res: HttpErrorResponse) {
  console.error(res);
  return throwError(res.error || 'Server error');
 }
}
