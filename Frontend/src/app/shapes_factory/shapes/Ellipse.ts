import { Dimension, Shape, Style, ShapeName, IShape } from "../Shape";
export class Ellipse extends IShape {

    private dimension: Dimension

    constructor(dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
    }

    drawShape(): void {
        let x1 = this.dimension.x_1, y1 = this.dimension.y_1
        let x2 = this.dimension.x_2, y2 = this.dimension.y_2
        let raduisX = Math.abs(x1 - x2)
        let raduisY = Math.abs(y1 - y2)

        // The Center is the First Click
        // ellipse(centerX, centerY, raduisX, raduisY, rotation, StartAngle(0), endAngle(360), antiClockWise) 
        // as we wanna draw complete ELLIPSE (0 : 360)
        this.ctx.ellipse(x1, y1, raduisX, raduisY, Math.PI, 0, 2 * Math.PI)
        this.ctx.fill()
        if (Number(this.style.line_width))
            this.ctx.stroke()
        this.ctx.beginPath()
    }

    getShape(): Shape {
        return {
            id: 0,
            name: ShapeName.Ellipse,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
