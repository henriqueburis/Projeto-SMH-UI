import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  url = "http://sjc.salvar.cemaden.gov.br/resources/dados/327_24.json";
  url2 = "http://localhost:8080/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=topp:tasmania_water_bodies&propertyName=AREA,PERIMETER&sortBy=AREA&startIndex=0&count=10";

  constructor(private httpClient: HttpClient) { }

  listar() {
    return this.httpClient.get(this.url2);
  }

}
