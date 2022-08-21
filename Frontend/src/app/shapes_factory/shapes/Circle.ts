import { Dimension, Shape, Style, ShapeName, IShape } from "../Shape";

export class Circle extends IShape {

    private dimension: Dimension

    constructor(dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean) {
        super(ctx, imageData, isDrawing, style)
        this.dimension = dimension
    }

    drawShape(): void {
        let x1 = this.dimension.x_1, y1 = this.dimension.y_1
        let x2 = this.dimension.x_2, y2 = this.dimension.y_2
        let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        this.ctx.arc(x1, y1, raduis, 0, Math.PI * 2);
        this.ctx.fill();
        if (Number(this.style.line_width))
            this.ctx.stroke();
        this.ctx.beginPath();
    }

    getShape(): Shape {
        return {
            id: 0,
            name: ShapeName.Circle,
            dimension: this.dimension,
            style: this.style,
            code: ''
        }
    }
}
