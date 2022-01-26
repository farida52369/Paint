export class Shape {
    constructor(
        public id : string,
        public shapeName: string,
        public shapeDimension: Dimension,
        public shapeStyle: Style
      ) { }
}

export class Dimension {
  constructor(
    public start_x : number,
    public start_y : number,
    public end_x : number,
    public end_y : number
  ){}
}

export class Style {
  constructor(
    public strokeStyle : string,
    public lineWidth : string,
    public fillStyle : string
  ) {}
}