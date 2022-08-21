export interface Shape {
  id : number,
  name: string,
  dimension: Dimension,
  style: Style,
  code: string
}

export interface Dimension {
  x_1 : number,
  y_1 : number,
  x_2 : number,
  y_2 : number
}

export interface Style {
  stroke_style : string,
  line_width : string,
  fill_style : string
}