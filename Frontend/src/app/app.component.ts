import { Shape, Dimension, Style, ShapeName } from './shapes_factory/Shape';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { PaintService } from '../service/paint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ShapeFactory } from './shapes_factory/ShapeFactory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private paintService: PaintService) { }

  // Canvas and Context
  canvas: any = null
  ghostCanvas: any = null
  ctx: any = null
  ghostCtx: any = null

  // Array I will save the shapes in it untill i make the backend :)) __ That's called improvement ..
  // To save the shapes all the time
  arr: Array<Shape> = []

  // Global Variables for Colors and Line Width
  globalFillColor: string = '#bd65e6'
  globalLineColor: string = '#65e67b'
  globalLineWidth: string = '1'

  // From Shapes Bar -- Selected Shape
  selectedShape: string = ''
  hasSelectedShape: boolean = false

  // alert
  saveBeforeLoad: boolean = true

  // (X, Y) current Point
  x: number = 0
  y: number = 0
  isDrawing: boolean = false

  // VARIABLES FOR SELECTION AND DRAGGING
  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3      4
  // 5  6  7
  selectionHandles: Array<any> = []

  isDrag: boolean = false
  isResizeDrag: boolean = false
  expectResize: number = -1  // New, will save the # of the selection handle if the mouse is over one.
  is_resize_move: boolean = false

  // The node (if any) being selected for moving, resizing, change attr..
  updatedShape: Shape | undefined
  updatedShapeIndex: number = -1
  // this var will help to make the choice of sending to the back as an action taken
  updatedShapeV2: Shape | undefined


  // The selection color and width. Right now we have a red selection with a small width
  mySelColor: string = '#000'
  mySelWidth: number = 1
  mySelBoxColor: string = '#FFF' // New for selection boxes
  mySelBoxSize: number = 6

  // 
  offsetx: number = 0
  offsety: number = 0

  // we iterate over all pixels, then we put the pixel array back to the canvas using putImageData()
  imageData: any = null
  shape: Shape | undefined

  ngAfterViewInit(): void {

    // Initialize Canvas and Context
    this.canvas = <HTMLCanvasElement>document.getElementById('Stage')
    this.ghostCanvas = <HTMLCanvasElement>document.getElementById('ghostCanvas')

    if (this.canvas.getContext && this.ghostCanvas.getContext) {
      this.ctx = this.canvas.getContext('2d')
      this.ghostCtx = this.ghostCanvas.getContext('2d')
    }

    this.sizeCanvas()
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

    // DB Work
    this.getAllShapes()
    this.drawCanvas(this.ctx);

    [this.canvas, this.ghostCanvas].forEach((ele) => {

      ele.addEventListener("mousedown", (e: any) => {
        // TO BE IN THE DOWN CLICK
        this.offsetx = e.offsetX
        this.offsety = e.offsetY

        if (this.is_resize_move) {
          this.selectShape(e)
          this.drawCanvas(this.ghostCtx)
        }

        if (this.hasSelectedShape && !this.updatedShape) {
          console.log("we are gonna draw new shape")
          // To keep the canvas has the last drawn shapes.
          this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

          // When clicking means starting positioning (x, y)
          this.x = e.offsetX
          this.y = e.offsetY
          this.isDrawing = true
        }
      });

      ele.addEventListener('mousemove', (e: any) => {
        if (this.isDrawing) {
          this.drawShape(this.getDimension(e), this.getStyle())
        }
        this.resizeShape(e)
      });

      ele.addEventListener('mouseup', (e: any) => {
        if (this.isDrawing) {
          this.saveCurrentShape()
        }
        // If Moving ?!
        this.sendUpdatedShapeToDatabase()
        this.isDrag = false
        this.isResizeDrag = false
        this.expectResize = -1
      });

    })
  }

  // RESIZING SHAPE
  resizeShape(e: any): void {
    let xm = e.offsetX, ym = e.offsetY
    if (this.updatedShape) {
      if (this.isDrag) {
        let xShift = xm - this.offsetx, yShift = ym - this.offsety
        this.offsetx = xm, this.offsety = ym
        this.updatedShape.dimension.x_1 += xShift
        this.updatedShape.dimension.y_1 += yShift
        this.updatedShape.dimension.x_2 += xShift
        this.updatedShape.dimension.y_2 += yShift
        this.drawCanvas(this.ghostCtx)
      } else if (this.isResizeDrag) {
        // 0  1  2
        // 3     4
        // 5  6  7
        if (this.updatedShape.name === ShapeName.Rectangle) {
          switch (this.expectResize) {
            case 0:
              this.updatedShape.dimension.x_1 = xm
              this.updatedShape.dimension.y_1 = ym
              break
            case 1:
              this.updatedShape.dimension.y_1 = ym
              break
            case 2:
              this.updatedShape.dimension.y_1 = ym
              this.updatedShape.dimension.x_2 = xm
              break
            case 3:
              this.updatedShape.dimension.x_1 = xm
              break
            case 4:
              this.updatedShape.dimension.x_2 = xm
              break
            case 5:
              this.updatedShape.dimension.x_1 = xm
              this.updatedShape.dimension.y_2 = ym
              break
            case 6:
              this.updatedShape.dimension.y_2 = ym
              break
            case 7:
              this.updatedShape.dimension.x_2 = xm
              this.updatedShape.dimension.y_2 = ym
              break
          }
        } else if (this.updatedShape.name === ShapeName.Circle ||
          this.updatedShape.name === ShapeName.Hexagon) {
          switch (this.expectResize) {
            case 1:
            case 3:
            case 4:
            case 6:
              this.updatedShape.dimension.x_2 = xm
              this.updatedShape.dimension.y_2 = ym
              break
          }
        } else {
          switch (this.expectResize) {
            case 0:
              this.updatedShape.dimension.x_1 = xm
              this.updatedShape.dimension.y_1 = ym
              break
            case 2:
              this.updatedShape.dimension.y_1 = ym
              this.updatedShape.dimension.x_2 = xm
              break
            case 5:
              this.updatedShape.dimension.x_1 = xm
              this.updatedShape.dimension.y_2 = ym
              break
            case 7:
              this.updatedShape.dimension.x_2 = xm
              this.updatedShape.dimension.y_2 = ym
              break
          }
        }
        this.drawCanvas(this.ghostCtx)
      }
    }

    // if there's a selection see if we grabbed one of the selection handles
    if (this.updatedShape && !this.isResizeDrag) {
      for (let i = 0; i < 8; i++) {
        // 0  1  2
        // 3      4
        // 5  6  7
        let cur = this.selectionHandles[i];
        // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (xm >= cur.x && xm <= cur.x + this.mySelBoxSize &&
          ym >= cur.y && ym <= cur.y + this.mySelBoxSize) {
          // we found one!
          this.expectResize = i
          switch (i) {
            case 0:
              this.ghostCanvas.style.cursor = 'nw-resize'
              break
            case 1:
              this.ghostCanvas.style.cursor = 'n-resize'
              break
            case 2:
              this.ghostCanvas.style.cursor = 'ne-resize';
              break;
            case 3:
              this.ghostCanvas.style.cursor = 'w-resize'
              break
            case 4:
              this.ghostCanvas.style.cursor = 'e-resize'
              break
            case 5:
              this.ghostCanvas.style.cursor = 'sw-resize'
              break
            case 6:
              this.ghostCanvas.style.cursor = 's-resize'
              break
            case 7:
              this.ghostCanvas.style.cursor = 'se-resize'
              break
          }
          return
        }
      }
      // not over a selection box, return to normal
      this.isResizeDrag = false
      this.expectResize = -1
      this.ghostCanvas.style.cursor = 'auto'
    }
  }


  // SELECT SHAPE
  selectShape(e: any): void {

    //we are over a selection box
    if (this.expectResize !== -1) {
      this.isResizeDrag = true
      this.isDrag = false
      return
    }

    // CLEAR GHOST CANVAS BEFORE ANY OPERATION
    this.clearCanvas(this.ghostCtx)
    for (let i = this.arr.length - 1; i >= 0; i--) {
      this.drawShapesUsingIndex(i, this.ghostCtx)

      // get image data at the mouse x,y pixel
      let imageData = this.ghostCtx.getImageData(e.offsetX, e.offsetY, 1, 1)

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        this.updatedShape = this.arr[i]
        this.updatedShapeV2 = JSON.parse(JSON.stringify(this.arr[i]))
        this.updatedShapeIndex = i
        this.isDrag = true
        this.clearCanvas(this.ghostCtx)
        console.log("SELECTED SHAPE NOW: " + this.updatedShape.name)
        return
      }
    }
    // havent returned means we have selected nothing
    this.updatedShape = undefined
    this.updatedShapeV2 = undefined
    this.clearCanvas(this.ghostCtx)
  }

  setDisplayCanvas(displayMainCanva: string, displayGhostCanva: string) {
    this.ghostCanvas.style.display = displayGhostCanva
    this.canvas.style.display = displayMainCanva
  }

  // Draw Shapes In Ghost Canvas
  drawShapesUsingIndex(i: number, canvas: any): void {
    let shape = this.arr[i]
    if (shape) {
      // Time To draw
      ShapeFactory.draw(shape.name, shape.dimension, shape.style, canvas, this.imageData, this.isDrawing)
    }
  }

  // CANVAS DRAWING :))
  drawCanvas(canvas: any) {
    this.clearCanvas(this.ctx)
    this.clearCanvas(this.ghostCtx);

    (canvas === this.ghostCtx) ? this.setDisplayCanvas('none', 'block') : this.setDisplayCanvas('block', 'none')

    // Render for Shapes in Main Canvas
    for (let i = 0; i < this.arr.length; i++) {
      if (this.updatedShape === this.arr[i]) continue
      this.drawShapesUsingIndex(i, canvas)
    }

    if (this.updatedShape) {
      this.drawShapesUsingIndex(this.updatedShapeIndex, canvas)
      this.setVarForSelectionBox(this.updatedShape)
    }
  }

  sizeCanvas(): void {
    // Fansty Numbers -- everyWhere -- height of first and second navBar
    this.canvas.width = window.innerWidth - 4
    this.canvas.height = window.innerHeight - 75 - 60

    this.ghostCanvas.width = window.innerWidth - 4
    this.ghostCanvas.height = window.innerHeight - 75 - 60
  }

  setLineWidth(lineWidth: any): void {
    this.globalLineWidth = lineWidth
    this.setStyleInRunTime(lineWidth, 'line width')
  }

  setLineColor(lineColor: any): void {
    this.globalLineColor = lineColor
    this.setStyleInRunTime(lineColor, 'line color')
  }

  setFillColor(fillColor: any): void {
    this.globalFillColor = fillColor
    this.setStyleInRunTime(fillColor, 'fill color')
  }

  setStyleInRunTime(style: any, type: string): void {

    if (this.updatedShape) {
      switch (type) {
        case 'line width':
          this.updatedShape.style.line_width = style
          break
        case 'line color':
          this.updatedShape.style.stroke_style = style
          break
        case 'fill color':
          this.updatedShape.style.fill_style = style
          break
      }

      // Modification
      this.clearCanvas(this.ghostCtx)
      this.drawCanvas(this.ghostCtx)
      this.sendUpdatedShapeToDatabase()
    }
  }

  // getting Dimensions and Style Shape
  getDimension(e: any): Dimension {
    return {
      x_1: this.x,
      y_1: this.y,
      x_2: e.offsetX,
      y_2: e.offsetY
    }
  }

  getStyle(): Style {
    return {
      stroke_style: this.globalLineColor,
      line_width: this.globalLineWidth,
      fill_style: this.globalFillColor
    }
  }

  // Now time to save the drawing
  saveCurrentShape(): void {
    this.isDrawing = false

    if (this.shape) {
      if (this.shape.name === ShapeName.Line && Number(this.globalLineWidth) === 0)
        return
      this.arr.push(this.shape)
      this.saveBeforeLoad = false
      this.postingShape()
      this.shape = undefined
    }
  }

  // FOR SELECTION BOX  --  :)
  // Draw Selection Box
  setVarForSelectionBox(shape: Shape): void {
    let x1 = shape.dimension.x_1, y1 = shape.dimension.y_1
    let x2 = shape.dimension.x_2, y2 = shape.dimension.y_2
    let h = 0, w = 0, x = 0, y = 0
    if (shape.name === ShapeName.Circle) {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
      h = w = raduis * 2
      x = x1 - raduis
      y = y1 - raduis
    } else if (shape.name === ShapeName.Line) {
      h = Math.abs(y1 - y2)
      w = Math.abs(x1 - x2)
      x = Math.min(x1, x2)
      y = Math.min(y1, y2)
    } else if (shape.name === ShapeName.Ellipse) {
      w = Math.abs(x1 - x2) * 2
      h = Math.abs(y1 - y2) * 2
      x = x1 - w / 2
      y = y1 - h / 2
    } else if (shape.name === ShapeName.Triangle) {
      h = Math.abs(y1 - y2)
      let temp = Math.abs(x2 - x1) * 2
      w = (x1 > x2) ? Math.abs(x2 - x1) * 3 : Math.abs(x2 - x1) * 2
      y = (y1 > y2) ? y2 : y2 - h
      x = x2 - temp
    } else if (shape.name === ShapeName.Rectangle) {
      w = Math.abs(x1 - x2)
      h = Math.abs(y1 - y2)
      x = x1
      y = y1
    } else if (shape.name === ShapeName.Pentagon) {   /// There's a problem Here :D
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
      h = raduis * Math.cos(27.0 * Math.PI / 180) * 2
      w = raduis * 2
      x = x1 - w / 2
      y = y1 - h / 2
    } else if (shape.name === ShapeName.Hexagon) {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
      h = raduis * Math.cos(Math.PI / 6) * 2
      w = raduis * 2
      x = x1 - w / 2
      y = y1 - h / 2
    } else if (shape.name === ShapeName.Square) {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
      h = raduis * Math.cos(45 * Math.PI / 180) * 2
      w = raduis * 2 * Math.cos(45 * Math.PI / 180)
      x = x1 - w / 2
      y = y1 - h / 2
    }
    let offset = Number(this.updatedShape?.style.line_width)
    this.drawSelectionBox(x - offset / 2, y - offset / 2, w + offset, h + offset)
  }

  drawSelectionBox(x: number, y: number, w: number, h: number): void {
    this.ghostCtx.strokeStyle = this.mySelColor
    this.ghostCtx.lineWidth = this.mySelWidth
    this.ghostCtx.strokeRect(x, y, w, h)

    // draw the boxes
    var half = this.mySelBoxSize / 2

    // 0  1  2
    // 3      4
    // 5  6  7
    // top left, middle, right
    this.selectionHandles[0] = {
      x: x - half,
      y: y - half
    }

    this.selectionHandles[1] = {
      x: x + w / 2 - half,
      y: y - half
    }

    this.selectionHandles[2] = {
      x: x + w - half,
      y: y - half
    }

    // middle left
    this.selectionHandles[3] = {
      x: x - half,
      y: y + h / 2 - half
    }

    // middle right
    this.selectionHandles[4] = {
      x: x + w - half,
      y: y + h / 2 - half
    }

    // bottom left, middle, right
    this.selectionHandles[6] = {
      x: x + w / 2 - half,
      y: y + h - half
    }

    this.selectionHandles[5] = {
      x: x - half,
      y: y + h - half
    }

    this.selectionHandles[7] = {
      x: x + w - half,
      y: y + h - half
    }

    this.ghostCtx.fillStyle = this.mySelBoxColor
    for (let i = 0; i < 8; i++) {
      let cur = this.selectionHandles[i]
      this.ghostCtx.fillRect(cur.x, cur.y, this.mySelBoxSize, this.mySelBoxSize)
      this.ghostCtx.strokeRect(cur.x, cur.y, this.mySelBoxSize, this.mySelBoxSize)
    }
  }

  drawShape(dim: Dimension, style: Style): void {
    this.shape = ShapeFactory.draw(this.selectedShape, dim, style, this.ctx, this.imageData, this.isDrawing)
  }

  clearCanvas(canva: any): void {
    canva.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  setSelectionShape(): void {
    this.updatedShape = undefined
    this.updatedShapeV2 = undefined
    this.updatedShapeIndex = -1
    this.is_resize_move = false
  }

  setNoShapeSelected(): void {
    this.hasSelectedShape = false
    this.selectedShape = ''
  }

  // POSTING A SHAPE TO THE BACKEND
  postingShape(): void {
    this.paintService.create_shape(this.shape).subscribe(
      () => {
        this.getAllShapes()
        console.log("I POSTED THE SHAPE TO THE BACKEND :)")
      }, (error: HttpErrorResponse) => console.log("7AZ AWFR EL MARA EL GAYA!!\nError: " + error.message)
    )
  }

  sendUpdatedShapeToDatabase(): void {
    if (this.updatedShape && JSON.stringify(this.updatedShape) !== JSON.stringify(this.updatedShapeV2)) {
      this.paintService.move(this.updatedShape).subscribe(
        () => console.log("WE'VE MOVED THE SHAPE IN THE BACKEND :)") // Fall back into place
        , (error: HttpErrorResponse) => console.log("I'M NOT GOING TO FALL BACK INTO PLACE!\nError: " + error.message)
      ) // End of subscribe 
      this.saveBeforeLoad = false
    }
  }

  // GETTING ALL SHAPES FROM THE BACKEND
  getAllShapes(): void {
    this.paintService.getAllShapes().subscribe(
      (response: Shape[]) => {
        console.log('The Length: ' + response.length)
        this.arr = response
        this.drawCanvas(this.ctx)
      }, (error: HttpErrorResponse) => console.error("7AZ AWFER ELMARA ELGAYA!\nError: " + error.message)
    )
  }

  setSelectedShape(shape: string): void {
    this.drawCanvas(this.ctx)

    this.hasSelectedShape = true
    this.selectedShape = shape
    this.setSelectionShape()
  }

  // OPTION TO RESIZE AND MOVE SHAPES
  resize_move(): void {
    this.is_resize_move = true

    // Set Selected Shape
    this.selectedShape = ''
    this.hasSelectedShape = false
  }

  delete(): void {
    if (this.updatedShape) {
      this.arr.splice(this.updatedShapeIndex, 1)
      this.drawCanvas(this.ctx)

      this.paintService.delete(this.updatedShape.code).subscribe(
        () => console.log('DONE DELETION BACKEND!')
        , (error: HttpErrorResponse) => console.log("ERROR! WHILE DELETEION\nError: " + error.message)
      ) // End Service..

      // Set updatedShapeShape
      this.setSelectionShape()
    }
  }

  copy(): void {
    if (this.updatedShape) {
      // DEEP COPY -- SHALLOW COPY IS BADDDD
      let shape: Shape = JSON.parse(JSON.stringify(this.updatedShape))
      shape.dimension.x_1 += 20
      shape.dimension.y_1 += 20
      shape.dimension.x_2 += 20
      shape.dimension.y_2 += 20
      this.arr.push(shape)
      this.drawCanvas(this.ctx)

      this.paintService.copy(shape).subscribe(
        () => {
          this.getAllShapes()
          console.log("I DID MY JOB AND COPIED THE SHAPE TO THE BACKEND: )")
        }, (error: HttpErrorResponse) => console.log("7AZ AWFR EL MARA EL GAYA!!\nError: " + error.message)
      ) // End of Service

      this.setSelectionShape()
    } // End of (If Selection is not undefined)

  }

  new(): void {
    if (this.saveBeforeLoad || confirm('You\'ll lose current drawings if not saved!')) {
      this.ngAfterViewInit()
      this.setSelectionShape()
      this.paintService.new().subscribe(
        () => {
          console.log("NEW DRAWING ON THE WAY!")
          this.getAllShapes()
        }, (error: HttpErrorResponse) => console.log('Fred, YOU BROKE MY HEART ..\nError: ' + error.message)
      )
    }
  }

  save(): void {
    this.paintService.save().subscribe(() => console.log("No PEOBLEM WHILE SAVING!")
      , (error: HttpErrorResponse) => console.log("SAVING PROBLEMS! PROBLEMS AS USUSAL :))\nError: " + error.message))

    this.saveBeforeLoad = true
    this.setSelectionShape()
  }

  load(): void {
    if (this.saveBeforeLoad || confirm('You\'ll lose current drawings if not saved!')) {
      this.paintService.load().subscribe(() => {
        console.log("No PROBLEM WHILE LOADING!")
        // Set updatedShape Shape
        this.setSelectionShape()
        // Get all the Pieces
        this.getAllShapes()
      }, (error: HttpErrorResponse) => console.log("LOADING PROBLEMS AS USUAL :)\nError: " + error.message)
      )
    }
  }

  redo(): void {
    this.paintService.redo().subscribe(() => {
      console.log("Done REDO!")
      this.setSelectionShape()
      this.getAllShapes()
    }, (error: HttpErrorResponse) => console.log("ERROR! WHAT DO YOU EXPECT!!\nError: " + error.message))

    this.setNoShapeSelected()
  }

  undo(): void {
    this.paintService.undo().subscribe(() => {
      console.log("Done UNDO!")
      this.setSelectionShape()
      this.getAllShapes()
    }, (error: HttpErrorResponse) => console.log("ERROR! WHAT DO YOU EXPECT!!\nError: " + error.message))

    this.setNoShapeSelected()
  }

  // Host Listener For basic Operations
  @HostListener('window:keydown.control.c', ['$event']) ctrlC() {
    this.copy()
  }

  @HostListener('window:keydown.control.z', ['$event']) ctrlZ() {
    this.undo()
  }

  @HostListener('window:keydown.control.y', ['$event']) ctrlY() {
    this.redo()
  }

  @HostListener('window:keydown.delete', ['$event']) del() {
    this.delete()
  }

  @HostListener('window:keydown.control.s', ['$event']) ctrlS() {
    this.save()
  }

  @HostListener('window:keydown.control.o', ['$event']) ctrlO() {
    this.load()
  }

  @HostListener('window:keydown.control.n', ['$event']) ctrlN() {
    this.new()
  }
}
