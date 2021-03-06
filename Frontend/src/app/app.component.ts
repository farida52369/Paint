import { Shape, Dimension, Style } from './shape';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { PaintService } from '../service/paint.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private paintService: PaintService) { }

  // Canvas and Context
  canvas: any = null;
  ghostCanvas: any = null;
  ctx: any = null;
  ghostCtx: any = null;

  // Style, Dimension and Shape name
  dimensions: Dimension = {
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0
  };

  style: Style = {
    strokeStyle: '',
    lineWidth: '',
    fillStyle: ''
  };

  shapeName: string = '';

  // Array I will save the shapes in it untill i make the backend :)) __ That's called improvement ..
  // To save the shapes all the time
  arr: Array<Shape> = [];

  // Global Variables for Colors and Line Width
  globalFillColor: string = '#bd65e6';
  globalLineColor: string = '#65e67b';
  globalLineWidth: string = '1';

  // From Shapes Bar -- Selected Shape
  selectedShape: string = '';
  hasSelectedShape: boolean = false;
  sendMoveToBackEndVar: boolean = false;
  
  // alert
  saveBeforeLoad: boolean = true

  // (X, Y) current Point
  x: number = 0;
  y: number = 0;
  drawingNow: boolean = false;

  // VARIABLES FOR SELECTION AND DRAGGING
  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  selectionHandles: Array<any> = [];

  isDrag: boolean = false;
  isResizeDrag: boolean = false;
  expectResize: number = -1;  // New, will save the # of the selection handle if the mouse is over one.

  is_resize_move: boolean = false;

  // The node (if any) being selected.
  mySelection: Shape | undefined
  mySelectionIndex: number = -1;

  // The selection color and width. Right now we have a red selection with a small width
  mySelColor: string = '#1E90FF';
  mySelWidth: number = 2;
  mySelBoxColor: string = '#A52A2A'; // New for selection boxes
  mySelBoxSize: number = 6;

  // 
  offsetx: number = 0
  offsety: number = 0

  // we iterate over all pixels, then we put the pixel array back to the canvas using putImageData()
  imageData: any = null

  ngAfterViewInit(): void {

    // Initialize Canvas and Context
    this.canvas = <HTMLCanvasElement>document.getElementById('Stage');
    this.ghostCanvas = <HTMLCanvasElement>document.getElementById('ghostCanvas');

    if (this.canvas.getContext && this.ghostCanvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ghostCtx = this.ghostCanvas.getContext('2d');
    }

    this.sizeCanvas();
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    // BD Work
    this.getAllShapes();
    this.drawCanvas(this.ctx);

    [this.canvas, this.ghostCanvas].forEach((ele) => {

      ele.addEventListener("mousedown", (e: any) => {
        // TO BE IN THE DOWN CLICK
        this.offsetx = e.offsetX
        this.offsety = e.offsetY

        if (this.is_resize_move) {
          this.selectShape(e);
          this.drawCanvas(this.ghostCtx);
        }

        if (this.hasSelectedShape && this.mySelection === undefined) {
          this.drawCanvas(this.ctx);

          // To keep the canvas has the last drawn shapes.
          this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

          // When clicking means starting positioning (x, y)
          this.x = e.offsetX;
          this.y = e.offsetY;
          this.drawingNow = true;
        }
      });


      ele.addEventListener('mousemove', (e: any) => {
        if (this.drawingNow) {
          let tempStyle = {
            strokeStyle: this.globalLineColor,
            lineWidth: this.globalLineWidth,
            fillStyle: this.globalFillColor
          }
          this.helpDrawingSelectedShape(this.x, this.y, e, tempStyle);
        }
        this.resizeShape(e);
        // console.log(this.mySelection);
      });

      ele.addEventListener('mouseup', (e: any) => {
        if (this.drawingNow) {
          let tempStyle = {
            strokeStyle: this.globalLineColor,
            lineWidth: this.globalLineWidth,
            fillStyle: this.globalFillColor
          }
          this.helpDrawingSelectedShape(this.x, this.y, e, tempStyle);
          this.saveCurrentDrawing(e);
          this.drawingNow = false;
          this.saveBeforeLoad = false;
        }  
        // If Moving ?!
        setTimeout(() => {
          this.sendMovedShapeToBackend();
          this.sendMoveToBackEndVar = false;
        }, 40);

        this.isDrag = false;
        this.isResizeDrag = false;
        this.expectResize = -1;
      });

    });

  }

  // RESIZING SHAPE
  resizeShape(e: any) {

    let xm = e.offsetX, ym = e.offsetY;
    if (this.mySelection !== undefined) {
      if (this.isDrag) {
        let xShift = xm - this.offsetx, yShift = ym - this.offsety;
        this.offsetx = xm, this.offsety = ym;

        this.mySelection.shapeDimension.start_x += xShift;
        this.mySelection.shapeDimension.start_y += yShift;
        this.mySelection.shapeDimension.end_x += xShift;
        this.mySelection.shapeDimension.end_y += yShift;

        this.arr[this.mySelectionIndex] = this.mySelection;
        this.drawCanvas(this.ghostCtx);
        this.sendMoveToBackEndVar = true;
      } else if (this.isResizeDrag) {
        // 0  1  2
        // 3     4
        // 5  6  7
        if (this.mySelection.shapeName === 'rectangle') {
          switch (this.expectResize) {
            case 0:
              this.mySelection.shapeDimension.start_x = xm;
              this.mySelection.shapeDimension.start_y = ym;
              break;
            case 1:
              this.mySelection.shapeDimension.start_y = ym;
              break;
            case 2:
              this.mySelection.shapeDimension.start_y = ym;
              this.mySelection.shapeDimension.end_x = xm;
              break;
            case 3:
              this.mySelection.shapeDimension.start_x = xm;
              break;
            case 4:
              this.mySelection.shapeDimension.end_x = xm;
              break;
            case 5:
              this.mySelection.shapeDimension.start_x = xm;
              this.mySelection.shapeDimension.end_y = ym;
              break;
            case 6:
              this.mySelection.shapeDimension.end_y = ym;
              break;
            case 7:
              this.mySelection.shapeDimension.end_x = xm;
              this.mySelection.shapeDimension.end_y = ym;
              break;
          }
        } else if (this.mySelection.shapeName === 'circle' || this.mySelection.shapeName === 'hexagon') {
          switch (this.expectResize) {
            case 1:
            case 3:
            case 4:
            case 6:  
              this.mySelection.shapeDimension.end_x = xm;
              this.mySelection.shapeDimension.end_y = ym;
              break;
          }
        } else {
          switch (this.expectResize) {
            case 0:
              this.mySelection.shapeDimension.start_x = xm;
              this.mySelection.shapeDimension.start_y = ym;
              break;
            case 2:
              this.mySelection.shapeDimension.start_y = ym;
              this.mySelection.shapeDimension.end_x = xm;
              break;
            case 5:
              this.mySelection.shapeDimension.start_x = xm;
              this.mySelection.shapeDimension.end_y = ym;
              break;
            case 7:
              this.mySelection.shapeDimension.end_x = xm;
              this.mySelection.shapeDimension.end_y = ym;
              break;
          }
        }
        this.arr[this.mySelectionIndex] = this.mySelection;
        this.drawCanvas(this.ghostCtx);
        this.sendMoveToBackEndVar = true;
        // console.log("ARE YOU ENTERING HERE!! AHH YA 2LABY");
      }
    }

    // if there's a selection see if we grabbed one of the selection handles
    if (this.mySelection !== undefined && !this.isResizeDrag) {
      for (let i = 0; i < 8; i++) {
        // 0  1  2
        // 3     4
        // 5  6  7
        let cur = this.selectionHandles[i];
        // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (xm >= cur.x && xm <= cur.x + this.mySelBoxSize &&
          ym >= cur.y && ym <= cur.y + this.mySelBoxSize) {
          // we found one!
          this.expectResize = i;
          // this.invalidate();
          switch (i) {
            case 0:
              this.ghostCanvas.style.cursor = 'nw-resize';
              break;
            case 1:
              this.ghostCanvas.style.cursor = 'n-resize';
              break;
            case 2:
              this.ghostCanvas.style.cursor = 'ne-resize';
              break;
            case 3:
              this.ghostCanvas.style.cursor = 'w-resize';
              break;
            case 4:
              this.ghostCanvas.style.cursor = 'e-resize';
              break;
            case 5:
              this.ghostCanvas.style.cursor = 'sw-resize';
              break;
            case 6:
              this.ghostCanvas.style.cursor = 's-resize';
              break;
            case 7:
              this.ghostCanvas.style.cursor = 'se-resize';
              break;
          }
          return;
        }
      }
      // not over a selection box, return to normal
      this.isResizeDrag = false;
      this.expectResize = -1;
      this.ghostCanvas.style.cursor = 'auto';
    }
  }


  // SELECT SHAPE
  selectShape(e: any) {

    //we are over a selection box
    if (this.expectResize !== -1) {
      this.isResizeDrag = true;
      // console.log("PLEASE MAKE IT TRUEEEE")
      this.isDrag = false;
      return;
    }

    // CLEAR GHOST CANVAS BEFORE ANY OPERATION
    this.clearCanvas(this.ghostCtx);
    let len = this.arr.length;
    for (let i = len - 1; i >= 0; i--) {
      this.drawShapesUsingIndex(i, this.ghostCtx);
      // get image data at the mouse x,y pixel
      let imageData = this.ghostCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        this.mySelection = this.arr[i];
        this.mySelectionIndex = i;
        this.isDrag = true;

        console.log("SELECTED SHAPE NOW: " + this.mySelection.shapeName);
        // console.log("SELECTED SHAPE DIMENSION NOW: " + this.mySelection.shapeDimension);
        // console.log("SELECTED SHAPE STYLE NOW: " + this.mySelection.shapeStyle);
        this.clearCanvas(this.ghostCtx);
        return;
      }
    }
    // havent returned means we have selected nothing
    this.mySelection = undefined;
    this.clearCanvas(this.ghostCtx);
  }

  styleDisplayCanvas(displayMainCanva: string, displayGhostCanva: string) {
    this.ghostCanvas.style.display = displayGhostCanva;
    this.canvas.style.display = displayMainCanva;
  }

  // Draw Shapes In Ghost Canvas
  drawShapesUsingIndex(i: any, canvas: any) {
    let shape = this.arr[i];
    if (shape === undefined) return;

    // Time To draw
    this.factoryShapes((shape.shapeDimension.start_x), shape.shapeDimension.start_y,
      shape.shapeDimension.end_x, shape.shapeDimension.end_y, shape.shapeName, canvas, shape.shapeStyle);
  }

  // FACTORY SHAPES
  factoryShapes(x1: number, y1: number, x2: number, y2: number, shapeType: string, canvas: any, tempStyle: any) {
    // Shapes -- update selectedShape variable
    if (shapeType === 'circle') {
      this.drawCircle(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'line') {
      this.drawLine(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'ellipse') {
      this.drawEllipse(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'triangle') {
      this.drawTriangle(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'rectangle') {
      this.drawRectangle(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'pentagon') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 5, canvas, tempStyle);
    } else if (shapeType === 'hexagon') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 6, canvas, tempStyle);
    } else if (shapeType === 'square') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 4, canvas, tempStyle);
    } // End of Factory ... 
  }

  // CANVAS DRAWING :))
  drawCanvas(canvas: any) {
    this.clearCanvas(this.ctx);
    this.clearCanvas(this.ghostCtx);

    (canvas == this.ghostCtx) ? this.styleDisplayCanvas('none', 'block') : this.styleDisplayCanvas('block', 'none');
    let len = this.arr.length;

    // console.log("The Length of the array: " + len)
    // Render for Shapes in Main Canvas
    for (let i = 0; i < len; i++) {
      if(this.mySelection == this.arr[i]) continue;
      this.drawShapesUsingIndex(i, canvas)
    }

    if (this.mySelection !== undefined) {
      this.drawShapesUsingIndex(this.mySelectionIndex, canvas);
      this.setVarForSelectionBox(this.mySelection.shapeDimension.start_x, this.mySelection.shapeDimension.start_y,
        this.mySelection.shapeDimension.end_x, this.mySelection.shapeDimension.end_y, this.mySelection.shapeName);
    }

  }

  sizeCanvas() {
    // Fansty Numbers -- everyWhere -- height of first and second navBar
    this.canvas.width = window.innerWidth - 4;
    this.canvas.height = window.innerHeight - 75 - 60;

    this.ghostCanvas.width = window.innerWidth - 4;
    this.ghostCanvas.height = window.innerHeight - 75 - 60;
  }

  attributeCanvas(ctx: any, lineColor: any, lineWidth: any, fillColor: any) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
  }

  setLineWidth(lineWidth: any) {
    this.globalLineWidth = lineWidth;
    this.setStyleInRunTime(lineWidth, 'line width');
  }

  setLineColor(lineColor: any) {
    this.globalLineColor = lineColor;
    this.setStyleInRunTime(lineColor, 'line color');
  }

  setFillColor(fillColor: any) {
    this.globalFillColor = fillColor;
    this.setStyleInRunTime(fillColor, 'fill color');
  }

  setStyleInRunTime(style : any, type : string) {
    if (this.mySelection !== undefined) {
      switch(type) {
        case 'line width' : 
          this.mySelection.shapeStyle.lineWidth = style;
          break;
        case 'line color':
          this.mySelection.shapeStyle.strokeStyle = style;
          break;
        case 'fill color':
          this.mySelection.shapeStyle.fillStyle = style;
          break;  
      }
      
      this.arr[this.mySelectionIndex] = this.mySelection;
      // Modification
      this.clearCanvas(this.ghostCtx);
      this.drawCanvas(this.ghostCtx);
      this.sendMovedShapeToBackend();
    }
  }

  // Setting Dimensions and Style Shape
  setDimension(x1: number, y1: number) {
    this.dimensions = {
      start_x: this.x,
      start_y: this.y,
      end_x: x1,
      end_y: y1
    };
  }

  setStyle() {
    this.style = {
      strokeStyle: this.globalLineColor,
      lineWidth: this.globalLineWidth,
      fillStyle: this.globalFillColor
    };
  }

  // Now time to save the drawing
  saveCurrentDrawing(e: any) {

    // Things we know about every shape
    this.shapeName = this.selectedShape;
    this.setDimension(e.offsetX, e.offsetY);
    this.setStyle();

    // BACKEND will be here to send the shape
    this.arr.push({
      shapeName: this.shapeName,
      shapeDimension: this.dimensions,
      shapeStyle: this.style,
      id: 0,
      shapeCode: ''
    })
    this.postingShape();

    // Setting (x, y) and drawingNow to initial values
    this.x = 0;
    this.y = 0;
  }

  // POSTING A SHAPE TO THE BACKEND
  postingShape() {
    let data = {
      shapeName: this.shapeName,
      shapeDimension: this.dimensions,
      shapeStyle: this.style,
    }

    this.paintService.create_shape(data).subscribe(
      () => {
        this.getAllShapes();
        console.log("I DID MY JOB AND POST THE SHAPE TO THE BACKEND: )")
      }, (error: HttpErrorResponse) => console.log("7AZ AWFR EL MARA EL GAYA!!\nError: " + error)
    )
  }

  sendMovedShapeToBackend() {
    // Wait .......
    if (this.mySelection !== undefined) {
      this.paintService.move(this.mySelection).subscribe(
      () => console.log("WE'VE MOVED THE SHAPE IN THE BACKEND :)") // Fall back into place
      ,(error: HttpErrorResponse) => console.log("I'M NOT GOING TO FALL BACK INTO PLACE!\nError: " + error)
      ); // End of subscribe 
    }
  }

  // GETTING ALL SHAPES FROM THE BACKEND
  getAllShapes() {
    this.paintService.getAllShapes().subscribe(
      (response: Shape[]) => {
        console.log('The Length: ' +  response.length)
        this.arr = response
        this.drawCanvas(this.ctx)
      }, (error: HttpErrorResponse) => console.error("7AZ AWFER EL MARA EL GAYA!\nError: " + error)
    )
  }

  // FOR SELECTION BOX  --  :)
  // Draw Selection Box
  setVarForSelectionBox(x1: number, y1: number, x2: number, y2: number, shape: string) {
    let h = 0, w = 0, x = 0, y = 0;
    if (shape === 'circle') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = w = raduis * 2;
      x = x1 - raduis;
      y = y1 - raduis;
    } else if (shape === 'line') {
      h = Math.abs(y1 - y2);
      w = Math.abs(x1 - x2);
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
    } else if (shape === 'ellipse') {
      w = Math.abs(x1 - x2) * 2;
      h = Math.abs(y1 - y2) * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    } else if (shape === 'triangle') {
      h = Math.abs(y1 - y2);
      let temp = Math.abs(x2 - x1) * 2;
      w = (x1 > x2) ? Math.abs(x2 - x1) * 3 : Math.abs(x2 - x1) * 2;
      y = (y1 > y2) ? y2 : y2 - h;
      x = x2 - temp;
    } else if (shape === 'rectangle') {
      w = Math.abs(x1 - x2);
      h = Math.abs(y1 - y2);
      x = x1;
      y = y1;
    } else if (shape === 'pentagon') {   /// There's a problem Here --- :)))
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(27.0 * Math.PI / 180) * 2;
      w = raduis * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    } else if (shape === 'hexagon') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(Math.PI / 6) * 2;
      w = raduis * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    } else if (shape === 'square') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(45 * Math.PI / 180) * 2;
      w = raduis * 2 * Math.cos(45 * Math.PI / 180);
      x = x1 - w / 2;
      y = y1 - h / 2;
    }

    let offset = Number(this.mySelection?.shapeStyle.lineWidth);
    this.drawSelectionBox(x - offset / 2, y - offset / 2, w + offset, h + offset);
  }

  drawSelectionBox(x: number, y: number, w: number, h: number) {

    this.ghostCtx.strokeStyle = this.mySelColor;
    this.ghostCtx.lineWidth = this.mySelWidth;
    this.ghostCtx.strokeRect(x, y, w, h);

    // draw the boxes
    var half = this.mySelBoxSize / 2;

    // 0  1  2
    // 3     4
    // 5  6  7
    // top left, middle, right
    this.selectionHandles[0] = {
      x: x - half,
      y: y - half
    };

    this.selectionHandles[1] = {
      x: x + w / 2 - half,
      y: y - half
    };

    this.selectionHandles[2] = {
      x: x + w - half,
      y: y - half
    };

    //middle left
    this.selectionHandles[3] = {
      x: x - half,
      y: y + h / 2 - half
    }

    //middle right
    this.selectionHandles[4] = {
      x: x + w - half,
      y: y + h / 2 - half
    }

    //bottom left, middle, right
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
    }
  }


  helpDrawingSelectedShape(x1: number, y1: number, e: any, tempStyle: any) {
    // Shapes -- update selectedShape variable
    if (this.selectedShape === 'circle') {
      this.drawCircle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'line') {
      this.drawLine(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'ellipse') {
      this.drawEllipse(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'triangle') {
      this.drawTriangle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'rectangle') {
      this.drawRectangle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'pentagon') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 5, this.ctx, tempStyle);
    } else if (this.selectedShape === 'hexagon') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 6, this.ctx, tempStyle);
    } else if (this.selectedShape === 'square') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 4, this.ctx, tempStyle);
    } // End of factory

  }

  /// SHAPES
  // STARTING DRAWING SHAPES, MANNNN!!!
  // Rectangle
  drawRectangle(x1: number, y1: number, x2: number, y2: number, ctx: any, tempStyle: any) {
    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0)
    }
    let w = Math.abs(x1 - x2)
    let h = Math.abs(y1 - y2)

    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle)
    ctx.fillRect(x1, y1, w, h)
    ctx.strokeRect(x1, y1, w, h)
    ctx.beginPath();
    // console.log("HAT4ALLLLL -- :)")
  }

  // Circle
  drawCircle(x1: number, y1: number, x2: number, y2: number, ctx: any, tempStyle: any) {
    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);
    ctx.arc(x1, y1, raduis, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
  }

  // Line
  drawLine(x1: number, y1: number, x2: number, y2: number, ctx: any, tempStyle: any) {
    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
  }

  // Ellipse
  drawEllipse(x1: number, y1: number, x2: number, y2: number, ctx: any, tempStyle: any) {

    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    let raduisX = Math.abs(x1 - x2);
    let raduisY = Math.abs(y1 - y2);
    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);

    // The Center is the First Click
    // ellipse(centerX, centerY, raduisX, raduisY, rotation, StartAngle(0), endAngle(360), antiClockWise) 
    // as we wanna draw complete ELLIPSE (0 : 360)
    ctx.ellipse(x1, y1, raduisX, raduisY, Math.PI, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
  }

  // Triangle
  drawTriangle(x1: number, y1: number, x2: number, y2: number, ctx: any, tempStyle: any) {

    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    let baseLine = Math.abs(x2 - x1) * 2;
    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);
    // (x1, y1) is the First Point
    // The Second will help to get a Equilateral Triangle 
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - baseLine, y2);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
  }

  // Shapes Equilateral
  drawShapesUsingCircles(x1: number, y1: number, x2: number, y2: number, sides: number, ctx: any, tempStyle: any) {

    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);

    // The First Point (x1, y1) is the center of the Shape
    let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    let angleCenter = 2 * Math.PI / sides;
    let rotationPentagon = (Math.PI / 180.0) * -18;
    let rotationSquare = (Math.PI / 180.0) * -45;

    let currentAngle;
    let rotation;
    // Loops for every edge in the Shape
    for (let i = 0; i < sides; i++) {
      rotation = (sides == 4) ? rotationSquare : (sides == 5) ? rotationPentagon : 0;
      currentAngle = i * angleCenter + rotation;
      ctx.lineTo(x1 + raduis * Math.cos(currentAngle), y1 + raduis * Math.sin(currentAngle));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
  }

  clearCanvas(canva: any) {
    canva.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setSelectionShape() {
    this.mySelection = undefined;
    this.mySelectionIndex = -1;
    this.is_resize_move = false;
  }

  setNoShapeSelected() {
    this.hasSelectedShape = false;
    this.selectedShape = ''
  }

  setSelectedShape(shape: string) {
    this.drawCanvas(this.ctx);
    this.hasSelectedShape = true;

    // Set resizing Variables __
    this.setSelectionShape();

    // Shapes -- update selectedShape variable
    if (shape === 'circle') {
      this.selectedShape = 'circle';
    } else if (shape === 'line') {
      this.selectedShape = 'line';
    } else if (shape === 'ellipse') {
      this.selectedShape = 'ellipse';
    } else if (shape === 'triangle') {
      this.selectedShape = 'triangle';
    } else if (shape === 'rectangle') {
      this.selectedShape = 'rectangle';
    } else if (shape === 'hexagon') {
      this.selectedShape = 'hexagon';
    } else if (shape === 'pentagon') {
      this.selectedShape = 'pentagon';
    } else if (shape === 'square') {
      this.selectedShape = 'square';
    } // End of factory

  }

  // OPTION TO RESIZE AND MOVE SHAPES
  resize_move() {
    this.drawCanvas(this.ctx);
    this.is_resize_move = true;

    // Set Selected Shape
    this.selectedShape = '';
    this.hasSelectedShape = false;
  }


  delete() {
    if (this.mySelection !== undefined) {
      this.arr.splice(this.mySelectionIndex, 1);
      this.drawCanvas(this.ctx);

      this.paintService.delete(this.mySelection.shapeCode).subscribe(
        () => console.log('DONE DELETION BACKEND!')
        , (error: HttpErrorResponse) => console.log("ERROR! WHILE DELETEION\nError: " + error)
      ) // End Service..

      // Set mySelectionShape
      this.setSelectionShape();
    }
  }

  copy() {
    if (this.mySelection !== undefined) {
      // DEEP COPY -- SHALLOW COPY IS BADDDD
      let shape: Shape = JSON.parse(JSON.stringify(this.mySelection));
      shape.shapeDimension.start_x += 20
      shape.shapeDimension.start_y += 20
      shape.shapeDimension.end_x += 20
      shape.shapeDimension.end_y += 20
      this.arr.push(shape);
      this.drawCanvas(this.ctx);

      this.paintService.copy(shape).subscribe(
        () => {
          this.getAllShapes();
          console.log("I DID MY JOB AND COPIED THE SHAPE TO THE BACKEND: )");
        }, (error: HttpErrorResponse) => console.log("7AZ AWFR EL MARA EL GAYA!!\nError: " + error)
      ); // End of Service

      this.setSelectionShape();
    } // End of (If Selection is not undefined)

  }

  new() {
    this.ngAfterViewInit();
    this.setSelectionShape();
    this.paintService.new().subscribe(
      () => {
        console.log("NEW DRAWING ON THE WAY!")
        this.getAllShapes();
      }, (error: HttpErrorResponse) => console.log('Fred, YOU BROKE MY HEART ..\nError: ' + error)
    )
  }

  save() {
    this.paintService.save().subscribe(() => console.log("No PEOBLEM WHILE SAVING!")
      , (error: HttpErrorResponse) => console.log("SAVING PROBLEMS! PROBLEMS AS USUSAL :))\nError: " + error));

    this.saveBeforeLoad = true;
    this.setSelectionShape();
  }

  load() {
    if (!this.saveBeforeLoad) {
      alert('You\'ll lose current drawings if not saved!')
    }
    this.paintService.load().subscribe(() => {
      console.log("No PROBLEM WHILE LOADING!")
      // Set mySelection Shape
      this.setSelectionShape();
      // Get all the Pieces
      this.getAllShapes();
    }, (error: HttpErrorResponse) => console.log("LOADING PROBLEMS AS USUAL :)\nError: " + error)
    )
  }

  redo() {
    this.paintService.redo().subscribe(() => {
      console.log("Done REDO!")
      this.setSelectionShape();
      this.getAllShapes();
    }, (error: HttpErrorResponse) => console.log("ERROR! WHAT DO YOU EXPECT!!\nError: " + error))
    
    this.setNoShapeSelected();
  }

  undo() {
    this.paintService.undo().subscribe(() => {
      console.log("Done UNDO!")
      this.setSelectionShape();
      this.getAllShapes();
    }, (error: HttpErrorResponse) => console.log("ERROR! WHAT DO YOU EXPECT!!\nError: " + error))

    this.setNoShapeSelected();
  }

  // Host Listener For basic Operations
  @HostListener('window:keydown.control.c', ['$event']) ctrlC() {
    this.copy();
  }

  @HostListener('window:keydown.control.z', ['$event']) ctrlZ() {
    this.undo();
  }

  @HostListener('window:keydown.control.y', ['$event']) ctrlY() {
    this.redo();
  }

  @HostListener('window:keydown.delete', ['$event']) del() {
    this.delete();
  }

  @HostListener('window:keydown.control.s', ['$event']) ctrlS() {
    this.save();
  }

  @HostListener('window:keydown.control.o', ['$event']) ctrlO() {
    this.load();
  }

  @HostListener('window:keydown.control.n', ['$event']) ctrlN() {
    this.new();
  }
}
