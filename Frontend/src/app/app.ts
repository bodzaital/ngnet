import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherForecast } from './weatherForecast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');

  protected weatherForecast: WeatherForecast[] = [];

  constructor(private http: HttpClient) {
    http.get<WeatherForecast[]>("http://localhost:5276/weatherforecast/").subscribe({
      next: (e) => this.weatherForecast = e,
      error: (e) => console.error("Failed to query endpoint.", e)
    });
  }
}
