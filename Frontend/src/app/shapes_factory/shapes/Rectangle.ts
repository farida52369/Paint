import { IShape } from "./IShape";
import { Dimension, Shape, Style } from "../ShapeAttr";
import { ShapeName } from "../ShapeName";

export class Rectangle extends IShape {

    private dimension: Dimension

    constructor(dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
    }

    drawShape(): void {
        let x1 = this.dimension.x_1, y1 = this.dimension.y_1
        let x2 = this.dimension.x_2, y2 = this.dimension.y_2
        let w = Math.abs(x1- x2)
        let h = Math.abs(y1 - y2)
        this.ctx.fillRect(x1, y1, w, h)
        if (Number(this.style.line_width))
            this.ctx.strokeRect(x1, y1, w, h)
        this.ctx.beginPath()
    }

    getShape(): Shape {
        return {
            id: 0,
            name: ShapeName.Rectangle,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
