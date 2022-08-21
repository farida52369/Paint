import { Shape, Style } from "../ShapeAttr";

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