// create a class for managing all the API endpoints

import { API_CONFIG } from "./config"
import type { Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./types";

class WeatherAPI {
    private createUrl(endpoint : string, params : Record<string, string | number>) {
        const searchparams = new URLSearchParams({
            appid : API_CONFIG.API_KEY, // this contains the app ID for the OpenWeather API
            ...params, // this contains things like latitude, longitude, city name, etc.
        })
        return `@{endpoint}?${searchparams.toString()}` // this returns the full URL for the API endpoint as a string. it will create the URL
    }

    private async fetchData<T>(url : string) : Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API error! status: ${response.statusText}`);
        }

        return response.json();
    }

    async getCurrentWeather({latitude, longitude} : Coordinates): Promise<WeatherData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, { 
            latitude : latitude.toString(),
            longitude : longitude.toString(),
            units : API_CONFIG.DEFAULT_PARAMS.units,
        }) // this entire thing refers to the createUrl method above

        return this.fetchData<WeatherData>(url)
    }

    async getForecast({latitude, longitude} : Coordinates): Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, { 
            latitude : latitude.toString(),
            longitude : longitude.toString(),
            units : API_CONFIG.DEFAULT_PARAMS.units,
        }) // this entire thing refers to the createUrl method above

        return this.fetchData<ForecastData>(url)
    }

    async reverseGeoCode({latitude, longitude} : Coordinates): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, { 
            latitude : latitude.toString(),
            longitude : longitude.toString(),
            limit : 1, // whatever the first result is, we will take it
        }) // this entire thing refers to the createUrl method above

        return this.fetchData<GeocodingResponse[]>(url)
    }
}

export const weatherAPI = new WeatherAPI(); // this exports an instance of the WeatherAPI class, so we can use it in other files