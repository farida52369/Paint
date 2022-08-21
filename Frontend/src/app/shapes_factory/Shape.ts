
export abstract class IShape {

    public ctx: any
    private imageData: any
    private isDrawing: boolean
    style: Style

    constructor(ctx: any, imageData: any, isDrawing: boolean, style: Style) {
        this.ctx = ctx
        this.imageData = imageData
        this.isDrawing = isDrawing
        this.style = style
        this.init()
    }

    private init(): void {
        if (this.isDrawing) {
            this.ctx.putImageData(this.imageData, 0, 0)
        }
        this.setAttributes()
    }

    private setAttributes(): void {
        this.ctx.strokeStyle = this.style.stroke_style;
        this.ctx.lineWidth = this.style.line_width;
        this.ctx.fillStyle = this.style.fill_style;
    }

    abstract drawShape(): void
    abstract getShape(): Shape
}

export interface Shape {
    id: number,
    name: string,
    dimension: Dimension,
    style: Style,
    code: string
}

export interface Dimension {
    x_1: number,
    y_1: number,
    x_2: number,
    y_2: number
}

export interface Style {
    stroke_style: string,
    line_width: string,
    fill_style: string
}

export class ShapeName {
    public static readonly Rectangle = 'rectangle'
    public static readonly Line = 'line'
    public static readonly Circle = 'circle'
    public static readonly Ellipse = 'ellipse'
    public static readonly Triangle = 'triangle'
    public static readonly Square = 'square'
    public static readonly Pentagon = 'pentagon'
    public static readonly Hexagon = 'hexagon'
}