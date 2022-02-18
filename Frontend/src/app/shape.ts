export interface Shape {
  id : number,
  shapeName: string,
  shapeDimension: Dimension,
  shapeStyle: Style,
  shapeCode: string
}

export interface Dimension {
  start_x : number,
  start_y : number,
  end_x : number,
  end_y : number
}

export interface Style {
  strokeStyle : string,
  lineWidth : string,
  fillStyle : string
}