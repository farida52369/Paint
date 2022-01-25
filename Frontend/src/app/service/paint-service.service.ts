import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shape } from '../shape';

@Injectable({
  providedIn: 'root'
})
export class PaintServiceService {

  constructor(private httpClient: HttpClient) { }

  paintURL: string = "http://localhost:8080/";

  sendShape(shape: any): Observable<HttpResponse<any>> {
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(this.paintURL + "shape", shape, {
      observe: 'response',
      'headers' : headers
    });
  }

  getAllShapes() : Observable <Shape[]> {
    return this.httpClient.get<Shape[]>(this.paintURL + "shapes");
  }

  saveAsJSON() {
    return this.httpClient.get(this.paintURL + "downloadJSON"); 
  }

  saveAsXML() {
    return this.httpClient.get(this.paintURL + "downloadXML"); 
  }

  loadING() {
    return this.httpClient.get(this.paintURL + "loadFile"); 
  }

}

