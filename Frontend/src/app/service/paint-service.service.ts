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

  // Create Shape ...
  create_shape(shape: any): Observable<Shape> {
    const headers = {'content-type' : 'application/json'};
    const body = JSON.stringify(shape);
    return this.httpClient.post<Shape>(this.paintURL + 'shape', body, {
      observe: 'body',
      'headers' : headers}
    );
  }

  // Get All Shapes
  getAllShapes() : Observable <Shape[]> {
    return this.httpClient.get<Shape[]>(this.paintURL + 'shapes');
  }

  save() {
    return this.httpClient.get(this.paintURL + 'save'); 
  }

  load() {
    return this.httpClient.get(this.paintURL + 'load'); 
  }

}

