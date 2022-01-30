import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shape } from '../app/shape';

@Injectable({
  providedIn: 'root'
})
export class PaintServiceService {

  constructor(private httpClient: HttpClient) { }
  paintURL: string = "http://localhost:8080/";

  // Create Shape ...
  create_shape(shape: any): Observable<Shape> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(shape);
    return this.httpClient.post<Shape>(this.paintURL + 'shape', body, {
      observe: 'body',
      'headers': headers
    }
    );
  }

  // Get All Shapes
  getAllShapes(): Observable<Shape[]> {
    return this.httpClient.get<Shape[]>(this.paintURL + 'shapes');
  }

  save() { // Save the drawing in XML and JSON format
    return this.httpClient.get(this.paintURL + 'save');
  }

  load() { // Load the drawing from XML and JSON format
    return this.httpClient.get(this.paintURL + 'load');
  }

  undo() {
    return this.httpClient.get(this.paintURL + 'undo');
  }

  redo() {
    return this.httpClient.get(this.paintURL + 'redo');
  }

  new() { // Somewhere in these eyes__
    return this.httpClient.get(this.paintURL + 'new');
  }

  delete(id: any) { // I thought You said you loved the ocean!
    console.log("Delete On Service: " + id + "  After stringfy: " + JSON.stringify(id))
    return this.httpClient.delete(this.paintURL + 'delete', {
      params: { id }
    });
  }

  // Move Shape ...
  move(id: any, dim: any, sty: any) { // Who will dry your eyes when it falls apart!!
    const dimension = JSON.stringify(dim), style = JSON.stringify(sty);  // When you like me .. I Smile :)
    return this.httpClient.post<Shape>(this.paintURL + 'move', { id, dimension, style }, {
      params: { id, dimension, style }
    }
    );
  }

  // Copy Shape ...
  copy(id: any, dim: any): Observable<Shape> {
    const dimension = JSON.stringify(dim); // When you like me .. I Smile :)
    return this.httpClient.post<Shape>(this.paintURL + 'copy', { id, dimension }, {
      params: { id, dimension },
      observe: 'body'
    }
    );
  }

}

