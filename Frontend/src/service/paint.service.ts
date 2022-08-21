import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shape } from '../app/shapes_factory/Shape';

@Injectable({
  providedIn: 'root'
})
export class PaintService {

  constructor(private httpClient: HttpClient) { }
  private paintURL: string = environment.apiBaseUrl

  // Create Shape ...
  create_shape(shape: any): Observable<void> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(shape);
    return this.httpClient.post<void>(`${this.paintURL}/paint/shape`, body, {
      'headers': headers
    })
  }

  // Get All Shapes ...
  getAllShapes(): Observable<Shape[]> {
    return this.httpClient.get<Shape[]>(`${this.paintURL}/paint/shapes`)
  }

  // Save Drawing ...
  save(): Observable<void> { // Save the drawing in XML and JSON format
    return this.httpClient.get<void>(`${this.paintURL}/paint/save`)
  }

  // Load Drawing ...
  load(): Observable<void> { // Load the drawing from XML and JSON format
    return this.httpClient.get<void>(`${this.paintURL}/paint/load`)
  }

  // Undo Action ...
  undo(): Observable<void> {
    return this.httpClient.get<void>(`${this.paintURL}/paint/undo`)
  }

  // Redo Action ...
  redo(): Observable<void> {
    return this.httpClient.get<void>(`${this.paintURL}/paint/redo`)
  }

  // New Drawings ...
  new(): Observable<void> { // Somewhere in these eyes__
    return this.httpClient.get<void>(`${this.paintURL}/paint/new`)
  }

  // Delete Shape ...
  delete(id: string): Observable<void> { // I thought You said you loved the ocean!
    return this.httpClient.delete<void>(`${this.paintURL}/paint/delete/${id}`)
  }

  // Move Shape ...
  move(shape: Shape): Observable<void> { // Who will dry your eyes when it falls apart!!
    return this.httpClient.put<void>(`${this.paintURL}/paint/move`, shape)
  }

  // Copy Shape ...
  copy(shape: Shape): Observable<void> { // When you like me .. I Smile :)
    return this.httpClient.post<void>(`${this.paintURL}/paint/copy`, shape)
  }
}
