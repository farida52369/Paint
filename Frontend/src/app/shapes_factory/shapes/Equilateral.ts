import { IShape } from "./IShape";
import { Dimension, Shape, Style } from "../ShapeAttr";
import { ShapeName } from "../ShapeName";

export class Equilateral extends IShape {

    private dimension: Dimension
    private shapeName: string

    constructor(dimension: Dimension, style: Style, shapeName: string,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
        this.shapeName = shapeName
    }

    drawShape(): void {

        let sides = -1
        switch (this.shapeName) {
            case ShapeName.Square:
                sides = 4
                break
            case ShapeName.Pentagon:
                sides = 5
                break
            case ShapeName.Hexagon:
                sides = 6
                break
        }
        // The First Point (x1, y1) is the center of the Shape
        // let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        let x1 = this.dimension.x_1, y1 = this.dimension.y_1
        let x2 = this.dimension.x_2, y2 = this.dimension.y_2
        let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        let angleCenter = 2 * Math.PI / sides
        let rotationPentagon = (Math.PI / 180.0) * -18
        let rotationSquare = (Math.PI / 180.0) * -45

        let currentAngle, rotation
        // Loops for every edge in the Shape
        for (let i = 0; i < sides; i++) {
            rotation = (sides === 4) ? rotationSquare : (sides === 5) ? rotationPentagon : 0
            currentAngle = i * angleCenter + rotation
            this.ctx.lineTo(x1 + raduis * Math.cos(currentAngle), y1 + raduis * Math.sin(currentAngle))
        }
        this.ctx.closePath()
        this.ctx.fill()
        if (Number(this.style.line_width))
            this.ctx.stroke()
        this.ctx.beginPath()
    }

    getShape(): Shape {
        return {
            id: 0,
            name: this.shapeName,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
