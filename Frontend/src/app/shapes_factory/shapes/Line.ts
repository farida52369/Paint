import { Dimension, Shape, Style, ShapeName, IShape } from "../Shape";

export class Line extends IShape {

    private dimension: Dimension

    constructor(dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
    }

    drawShape(): void {
        this.ctx.moveTo(this.dimension.x_1, this.dimension.y_1)
        this.ctx.lineTo(this.dimension.x_2, this.dimension.y_2)
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.beginPath()
    }

    getShape(): Shape {
        return {
            id: 0,
            name: ShapeName.Line,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
