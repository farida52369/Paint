import { IShape } from "./IShape";
import { Dimension, Shape, Style } from "../ShapeAttr";
import { ShapeName } from "../ShapeName";

export class Triangle extends IShape {

    private dimension: Dimension

    constructor(dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
    }

    drawShape(): void {
        let x1 = this.dimension.x_1, y1 = this.dimension.y_1
        let x2 = this.dimension.x_2, y2 = this.dimension.y_2
        let baseLine = Math.abs(x2 - x1) * 2
        // (x1, y1) is the First Point
        // The Second will help to get a Equilateral Triangle 
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2 - baseLine, y2)
        this.ctx.lineTo(x2, y2)
        this.ctx.closePath()
        this.ctx.fill()
        if (Number(this.style.line_width))
            this.ctx.stroke()
        this.ctx.beginPath()
    }

    getShape(): Shape {
        return {
            id: 0,
            name: ShapeName.Triangle,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
