import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { PaintServiceService } from './service/paint-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Frontend';

  constructor(private paintService : PaintServiceService) {}
  
  // Canvas and Context
  canvas : any = null;
  ghostCanvas : any = null;
  ctx : any = null;
  ghostCtx : any = null;

  // Style, Dimension and Shape name
  dimensions : any = {};
  style : any = {};
  shapeName : string = '';

  // Array I will save the shapes in it untill i make the backend :))
  arr : Array<any> = [];
  dataShapes : Array<any> = [];

  // Global Variables for Colors and Line Width
  globalFillColor : string = '#bd65e6';
  globalLineColor : string = '#65e67b';
  globalLineWidth : string = '1';


  // From Shapes Bar -- Selected Shape
  selectedShape : string = '';

  // (X, Y) current Point
  // (StartX, StartY) last Point
  x : number = 0;
  y : number = 0;
  drawingNow : boolean = false;
  hasSelectedShape : boolean = false;

  // VARIABLES FOR SELECTION AND DRAGGING

  // New, holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  selectionHandles : Array<any> = [];

  isDrag : boolean = false;
  isResizeDrag : boolean = false;
  expectResize : number = -1;  // New, will save the # of the selection handle if the mouse is over one.

  is_resize_move : boolean = false;


  // when set to true, the canvas will redraw everything
  // invalidate() just sets this to false right now
  // we want to call invalidate() whenever we make a change
  canvasValid = false;

  // The node (if any) being selected.
  mySelection : any = null;
  mySelectionIndex : number = 0;

  // The selection color and width. Right now we have a red selection with a small width
  mySelColor : string = '#CC0000';
  mySelWidth : number = 2;
  mySelBoxColor : string = 'darkred'; // New for selection boxes
  mySelBoxSize : number = 6;

  offsetx : number = 0
  offsety : number = 0

  // SAVE VARIABLES
  saveElementID : any = null;
  saveList : any = null;

  // we iterate over all pixels, then we put the pixel array back to the canvas using putImageData()
  imageData : any = null

  ngAfterViewInit(): void {
    // Initialize Canvas and Context
    this.canvas = <HTMLCanvasElement> document.getElementById('Stage');
    this.ghostCanvas = <HTMLCanvasElement> document.getElementById('ghostCanvas');
    this.saveElementID = document.getElementById('saveItem');
    this.saveList = document.getElementById('saveList');



    
    /*
    this.saveElementID.addEventListener('mouseover', (e : any) => {
      this.saveList.style.display = 'block';
    });

    this.saveElementID.addEventListener('mouseout', (e : any) => {
      this.saveList.style.display = 'none';
    })
    */

    if(this.canvas.getContext && this.ghostCanvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ghostCtx = this.ghostCanvas.getContext('2d');
    }
    this.sizeCanvas();
    
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    

    [this.canvas, this.ghostCanvas].forEach((ele) => {
      // mousedown Event Listenser
      ele.addEventListener("mousedown", (e : any) => { 
        // TO BE IN THE DOWN CLICK
        this.offsetx = e.offsetX
        this.offsety = e.offsetY

        if (this.is_resize_move) {
          this.selectShape(e);
          console.log("HOW MANY SELECTIONS")
          this.drawCanvas(this.ghostCtx);
        }

      
        if (this.hasSelectedShape && this.mySelection == null) {
          this.drawCanvas(this.ctx);
          // To keep the canvas has the last drawn shapes.
          this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          // When clicking means starting positioning (x, y)
          this.x = e.offsetX;
          this.y = e.offsetY;
          this.drawingNow = true;
        }
      });


      ele.addEventListener('mousemove', (e : any) => {
        if (this.drawingNow) {
          let tempStyle = {
            strokeStyle : this.globalLineColor,
            lineWidth : this.globalLineWidth,
            fillStyle : this.globalFillColor
        }
          this.helpDrawingSelectedShape(this.x, this.y, e, tempStyle);
        }
        this.resizeShape(e);
        // console.log(this.mySelection);
      });

      ele.addEventListener('mouseup', (e : any) => {
        if (this.drawingNow) {
          let tempStyle = {
              strokeStyle : this.globalLineColor,
              lineWidth : this.globalLineWidth,
              fillStyle : this.globalFillColor
          }
          this.helpDrawingSelectedShape(this.x, this.y, e, tempStyle);
          this.saveCurrentDrawing(e);
          this.drawingNow = false;
        }

        this.isDrag = false;
        this.isResizeDrag = false;
        this.expectResize = -1;
      
      });
    });
    
    
  }

  // RESIZING SHAPE
  resizeShape(e : any) {

    let xm = e.offsetX, ym = e.offsetY;
    if(this.mySelection !== null) {
    
      if (this.isDrag) {
        
        let xShift = xm  - this.offsetx, yShift = ym - this.offsety;
        this.offsetx = xm, this.offsety = ym;
        this.mySelection.dimension.start_x += xShift;
        this.mySelection.dimension.start_y += yShift;   
        this.mySelection.dimension.end_x += xShift;
        this.mySelection.dimension.end_y += yShift;   

        this.arr[this.mySelectionIndex] = this.mySelection;
        this.drawCanvas(this.ghostCtx);
      } else if (this.isResizeDrag) {

        // 0  1  2
        // 3     4
        // 5  6  7
        if (this.mySelection.shape === 'RECTANGLE') {
          switch (this.expectResize) {
            case 0:
              this.mySelection.dimension.start_x = xm;
              this.mySelection.dimension.start_y = ym;
              break;
            case 1:
              this.mySelection.dimension.start_y = ym;
              break;
            case 2:
              this.mySelection.dimension.start_y = ym;
              this.mySelection.dimension.end_x = xm;
              break;
            case 3:
              this.mySelection.dimension.start_x = xm;
              break;
            case 4:
              this.mySelection.dimension.end_x = xm;
              break;
            case 5:
              this.mySelection.dimension.start_x = xm;
              this.mySelection.dimension.end_y = ym;
              break;
            case 6:
              this.mySelection.dimension.end_y = ym;
              break;
            case 7:
              this.mySelection.dimension.end_x = xm;
              this.mySelection.dimension.end_y = ym;
              break;
          }
        } else {
          switch (this.expectResize) {
            case 0:
              this.mySelection.dimension.start_x = xm;
              this.mySelection.dimension.start_y = ym;
              break;
            case 2:
              this.mySelection.dimension.start_y = ym;
              this.mySelection.dimension.end_x = xm;
              break;
            case 5:
              this.mySelection.dimension.start_x = xm;
              this.mySelection.dimension.end_y = ym;
              break;
            case 7:
              this.mySelection.dimension.end_x = xm;
              this.mySelection.dimension.end_y = ym;
              break;
          }
        }
        
        this.arr[this.mySelectionIndex] = this.mySelection;
        this.drawCanvas(this.ghostCtx);
        // console.log("ARE YOU ENTERING HERE!! AHH YA 2LABY");
        // this.invalidate();
      }
    }
      

      // if there's a selection see if we grabbed one of the selection handles
      if (this.mySelection !== null && !this.isResizeDrag) {
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
                this.ghostCanvas.style.cursor='nw-resize';
                break;
              case 1:
                this.ghostCanvas.style.cursor='n-resize';
                break;
              case 2:
                this.ghostCanvas.style.cursor='ne-resize';
                break;
              case 3:
                this.ghostCanvas.style.cursor='w-resize';
                break;
              case 4:
                this.ghostCanvas.style.cursor='e-resize';
                break;
              case 5:
                this.ghostCanvas.style.cursor='sw-resize';
                break;
              case 6:
                this.ghostCanvas.style.cursor='s-resize';
                break;
              case 7:
                this.ghostCanvas.style.cursor='se-resize';
                break;
            }
            return;
          }           
        }
        // not over a selection box, return to normal
        this.isResizeDrag = false;
        this.expectResize = -1;
        this.ghostCanvas.style.cursor='auto';
      }
    
  }

  
  // SELECT SHAPE
  selectShape(e : any) {
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

      // Draw on ghost
      this.drawShapesUsingIndex(i, this.ghostCtx);
      // get image data at the mouse x,y pixel
      let imageData = this.ghostCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
      
      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        
        this.mySelection = this.arr[i];
        this.mySelectionIndex = i;
        this.isDrag = true;
        
        console.log("SELECTED SHAPE NOW: " + this.mySelection.shape);
        console.log("SELECTED SHAPE DIMENSION NOW: " + this.mySelection.dimension);
        console.log("SELECTED SHAPE STYLE NOW: " + this.mySelection.style);
        // this.invalidate();
        this.clearCanvas(this.ghostCtx);
        return;
      }
    }

    // havent returned means we have selected nothing
    this.mySelection = null;
    this.clearCanvas(this.ghostCtx);
    console.log("HIIIIIIIIIIIIIIIIII NO SELECTION!!");
  }

  styleDisplayCanvas(displayMainCanva : string, displayGhostCanva : string) {
    this.ghostCanvas.style.display = displayGhostCanva;
    this.canvas.style.display = displayMainCanva;
  }

  // Draw Shapes In Ghost Canvas
  drawShapesUsingIndex(i : any, canvas : any) {
    let shape = this.arr[i];
    if(shape == null) {
      return;
    }
    let shapeType = shape.shape;
    // Setting Styles
    // this.attributeCanvas(canvas, shape.style.strokeStyle, shape.style.lineWidth, shape.style.fillStyle)
    // console.log("HI COLORS: " + this.globalFillColor + " " + shape.style.fillStyle + " " + this.globalLineColor)
    
    // Time To draw
    this.factoryShapes(shape.dimension.start_x, shape.dimension.start_y, 
      shape.dimension.end_x, shape.dimension.end_y, shapeType, canvas, shape.style);
  }

  // FACTORY SHAPESSS
  factoryShapes(x1 : number, y1 : number, x2 : number, y2 : number, shapeType : string, canvas : any, tempStyle : any) {
    // Shapes -- update selectedShape variable
    if(shapeType === 'CIRCLE') {
      this.drawCircle(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'LINE') {
      this.drawLine(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'ELLIPSE') {
      this.drawEllipse(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'TRIANGLE') {
      this.drawTriangle(x1, y1, x2, y2, canvas, tempStyle);
    } else if (shapeType === 'RECTANGLE') {
      this.drawRectangle(x1, y1, x2, y2, canvas, tempStyle);
    }else if (shapeType === 'PENTAGON') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 5, canvas, tempStyle);
    } else if (shapeType === 'HEXAGON') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 6, canvas, tempStyle);
    }  else if (shapeType === 'SQUARE') {
      this.drawShapesUsingCircles(x1, y1, x2, y2, 4, canvas, tempStyle);
    } 
  }

  // CANVAS DRAWING :))
  drawCanvas(canvas : any) {
    this.clearCanvas(this.ctx);
    this.clearCanvas(this.ghostCtx);
    (canvas == this.ghostCtx)? this.styleDisplayCanvas('none', 'block'):
                                              this.styleDisplayCanvas('block', 'none');
    let len  = this.arr.length;
    // render for Shapes in Main Canvas
    for (let i = 0; i < len; i++) {
      this.drawShapesUsingIndex(i, canvas);
    }
    if(this.mySelection !== null) {
      this.setVarForSelectionBox(this.mySelection.dimension.start_x, this.mySelection.dimension.start_y, 
        this.mySelection.dimension.end_x, this.mySelection.dimension.end_y, this.mySelection.shape);
    }
  }

  invalidate() {
    this.canvasValid = false;
  }

  sizeCanvas() {
    // Fansty Numbers -- everyWhere
    this.canvas.style.marginLeft= "48px";
    this.canvas.width = window.innerWidth - 63;
    this.canvas.height = window.innerHeight - 138.8;

    this.ghostCanvas.style.marginLeft = "48px";
    this.ghostCanvas.width = window.innerWidth - 63;
    this.ghostCanvas.height = window.innerHeight - 138.8;
  }

  attributeCanvas(ctx : any, lineColor : any, lineWidth : any, fillColor : any) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
  }

  setLineWidth(lineWidth : any) {
    this.globalLineWidth = lineWidth;
  }

  setLineColor(lineColor : any) {
    this.globalLineColor = lineColor;
  }

  setFillColor(fillColor : any) {
    this.globalFillColor = fillColor;
  }

  // Setting Dimensions and Style Shape
  setDimension(x1 : number, y1 : number) {
    this.dimensions = {
      start_x : this.x,
      start_y : this.y,
      end_x : x1,
      end_y : y1
    };
  }

  setStyle() {
    this.style = {
      strokeStyle : this.globalLineColor,
      lineWidth : this.globalLineWidth,
      fillStyle : this.globalFillColor
    };
  }

  // Now time to save the drawing
  saveCurrentDrawing(e : any) {
    // Things we know about every shape
    this.shapeName = this.selectedShape;
    this.setDimension(e.offsetX, e.offsetY);
    this.setStyle();

    // BACKEND will be here to send the shape
    this.arr.push({
      shape : this.shapeName,
      dimension : this.dimensions,
      style : this.style
    })

    this.shapeName = this.shapeName.toUpperCase();
    // this.postingShape();
    console.log(typeof this.style + "  :  " + this.style + " Name: " + this.shapeName);

    // Setting (x, y) and drawingNow to initial values
    this.x = 0;
    this.y = 0;
    this.drawingNow = false;

  }

  // POSTING A SHAPE TO THE BACKEND
  postingShape() {
    let data = {
      shapeName : this.shapeName,
      shapeDimension : this.dimensions,
      shapeStyle : this.style
    }

    this.paintService.sendShape(JSON.stringify(data)).subscribe(
      (response) => {
        console.log("I DID MY JOB AND POST THE SHAPE TO THE BACKEND: " + response.status);
      },
      (error) => {
        console.log("7AZ AWFR EL MARA EL GAYA");
    });
  }

  // GETTING ALL SHAPES FROM THE BACKEND
  getAllShapes() {
    /*
    this.paintService.getAllShapes().subscribe((response) => {
      let indices = Object.keys(response);
      let res = JSON.parse(JSON.stringify(response));
      this.dataShapes = [];
      for(let i =0 ;i <indices.length;i++){ 
        let shape = res[indices[i]];
        this.dataShapes.push({
          id : shape.id,
          shape : shape.shapeName,
          dimension : shape.shapeDimension,
          style : shape.shapeStyle});
      }
    }, (error) => {
      console.log("7AZ AWFR EL MARA EL GAYA: " + error);
    });
    */
    // this.drawCanvas(this.ctx);
  }

  // FOR SELECTION
  // Draw Selection Box
  setVarForSelectionBox(x1 : number, y1 : number, x2 : number, y2 : number, shape : string) {
    let h = 0, w = 0, x = 0, y  =0;
    if(shape === 'CIRCLE') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = w = raduis * 2;
      x = x1 - raduis ;
      y = y1 - raduis;
    } else if (shape === 'LINE') {
      h = Math.abs(y1 - y2);
      w = Math.abs(x1 - x2);
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
    } else if (shape === 'ELLIPSE') {
      w = Math.abs(x1 - x2) * 2;
      h = Math.abs(y1 - y2) * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    } else if (shape === 'TRIANGLE') {
      h = Math.abs(y1 - y2);
      let temp = Math.abs (x2 - x1) * 2;
      w = (x1 > x2) ? Math.abs (x2 - x1) * 3 : Math.abs (x2 - x1) * 2;
      y = (y1 > y2) ? y2 : y2 - h;
      x = x2 - temp;
    } else if (shape === 'RECTANGLE') {
      w = Math.abs(x1 - x2);
      h = Math.abs(y1 - y2);
      x = x1;
      y = y1;
    } else if (shape === 'PENTAGON') {   /// There's a problem Here --- :)))
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(27.0 * Math.PI / 180) * 2;
      w = raduis * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    } else if (shape === 'HEXAGON') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(Math.PI / 6) * 2;
      w = raduis * 2;
      x = x1 - w / 2;
      y = y1 - h / 2;
    }  else if (shape === 'SQUARE') {
      let raduis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      h = raduis * Math.cos(45 * Math.PI / 180) * 2;
      w = raduis * 2 * Math.cos(45 * Math.PI / 180);
      x = x1 - w / 2;
      y = y1 - h / 2;
    } 
    this.drawSelectionBox(x, y, w, h);
  }

  drawSelectionBox(x : number, y : number, w : number, h : number) {
    
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
      x : x - half,
      y : y - half
    };
    
    this.selectionHandles[1] = {
      x : x + w/2 - half,
      y : y - half
    };
    
    this.selectionHandles[2] = {
      x : x + w - half,
      y : y - half
    };
    
    //middle left
    this.selectionHandles[3] = {
      x : x - half,
      y : y + h/2 - half
    }
    
    //middle right
    this.selectionHandles[4] = {
      x : x + w - half,
      y : y + h/2 - half
    }
    
    //bottom left, middle, right
    this.selectionHandles[6] = {
      x : x + w/2 - half,
      y : y + h - half
    }
    
    this.selectionHandles[5] = {
      x : x - half,
      y : y + h - half
    }
    
    this.selectionHandles[7] = {
      x : x + w - half,
      y : y + h - half
    }
    
    this.ghostCtx.fillStyle = this.mySelBoxColor;
    for (let i = 0; i < 8; i ++) {
      let cur = this.selectionHandles[i];
      this.ghostCtx.fillRect(cur.x, cur.y, this.mySelBoxSize, this.mySelBoxSize);
      // console.log("HELLLLO SELECTION BOX -- HOPE U WORK")
    }
  }

  helpDrawingSelectedShape(x1 : number, y1 : number, e : any, tempStyle : any) {
    // Shapes -- update selectedShape variable
    if(this.selectedShape === 'CIRCLE') {
      this.drawCircle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'LINE') {
      this.drawLine(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'ELLIPSE') {
      this.drawEllipse(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'TRIANGLE') {
      this.drawTriangle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    } else if (this.selectedShape === 'RECTANGLE') {
      this.drawRectangle(x1, y1, e.offsetX, e.offsetY, this.ctx, tempStyle);
    }else if (this.selectedShape === 'PENTAGON') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 5, this.ctx, tempStyle);
    } else if (this.selectedShape === 'HEXAGON') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 6, this.ctx, tempStyle);
    }  else if (this.selectedShape === 'SQUARE') {
      this.drawShapesUsingCircles(x1, y1, e.offsetX, e.offsetY, 4, this.ctx, tempStyle);
    } 

  }

  /// SHAPESSSSSSSSSSSSSSSSSSSSS
  // STARTING DRAWING SHAPES, MANNNN!!!
  // Rectangle
  drawRectangle(x1 : number, y1 : number, x2 : number, y2 : number, ctx : any, tempStyle : any) {
    
    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    
    let w = Math.abs(x1 - x2);
    let h = Math.abs(y1 - y2);
    
    this.attributeCanvas(ctx, tempStyle.strokeStyle, tempStyle.lineWidth, tempStyle.fillStyle);
    ctx.fillRect(x1, y1, w, h);
    ctx.strokeRect(x1, y1, w, h);
    ctx.beginPath();
    
    // console.log("HAT4ALLLLL -- :)")
  }

  // Circle
  drawCircle(x1 : number, y1 : number, x2 : number, y2 : number, ctx : any, tempStyle : any) {
    
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
  drawLine(x1 : number, y1 : number, x2 : number, y2 : number, ctx : any, tempStyle : any) {
    
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
  drawEllipse(x1 : number, y1 : number, x2 : number, y2 : number, ctx : any, tempStyle : any) {
    
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
  drawTriangle(x1 : number, y1 : number, x2 : number, y2 : number, ctx : any, tempStyle : any) {

    if (this.drawingNow) {
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    let baseLine =Math.abs (x2 - x1) * 2; 
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
  drawShapesUsingCircles(x1 : number, y1 : number, x2 : number, y2 : number, sides : number, ctx : any, tempStyle : any) {

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
    for(let i = 0; i < sides; i++){
      rotation = (sides == 4)?  rotationSquare : (sides == 5)? rotationPentagon : 0;
      currentAngle = i * angleCenter + rotation ;
      ctx.lineTo(x1 + raduis * Math.cos(currentAngle) , y1 + raduis * Math.sin(currentAngle));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
  }

  clearCanvas(canva : any) {
    canva.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setSelectedShape(shape : string) {
    this.drawCanvas(this.ctx);
    this.hasSelectedShape = true;
    // this.mySelection = null;
    // this.mySelectionIndex = 0;
    // Shapes -- update selectedShape variable
    if(shape === 'CIRCLE') {
      this.selectedShape = 'CIRCLE';
    } else if (shape === 'LINE') {
      this.selectedShape = 'LINE';
    } else if (shape === 'ELLIPSE') {
      this.selectedShape = 'ELLIPSE';
    } else if (shape === 'TRIANGLE') {
      this.selectedShape = 'TRIANGLE';
    } else if (shape === 'RECTANGLE') {
      this.selectedShape = 'RECTANGLE'; 
    } else if (shape === 'HEXAGON') {
      this.selectedShape = 'HEXAGON';
    } else if (shape === 'PENTAGON') {
      this.selectedShape = 'PENTAGON';
    } else if (shape === 'SQUARE') {
      this.selectedShape = 'SQUARE';
    } 
  }

  // OPTION TO RESIZE AND MOVE SHAPES
  resize_move() {
    this.drawCanvas(this.ctx);
    this.is_resize_move = true;
    this.selectedShape = '';
    this.hasSelectedShape = false
  }
  
  openDrawing() {
    /*
    this.paintService.loadING().subscribe(
      (res) => {console.log("DRAWING OPENNED");},
      (error) => {console.log("7az awfr el mara el gaya IN SAVING XML!!")
    });
    */
  }

  delete() {
    if (this.mySelection != null) {
      this.arr.splice(this.mySelectionIndex, 1);
      this.drawCanvas(this.ctx);
      console.log("NUM OF ELEMENTS AFTER DELETION: " + this.arr.length);
    }
    /*
    for(let i = 0; i < this.arr.length; i++) {
      console.log(this.arr[i].shape)
    }
    */
    console.log("DELETE DONE!")
  }

  copy() {
    if(this.mySelection != null) {
      // DEEP COPY -- SHALLOW COPY IS BADDDD
      let shape = JSON.parse(JSON.stringify(this.mySelection));

      shape.dimension.start_x += 20;
      shape.dimension.start_y += 20;
      shape.dimension.end_x += 20;
      shape.dimension.end_y += 20;
      this.arr.push(shape);
      this.drawCanvas(this.ctx);
    }
    /*
    for(let i = 0; i < this.arr.length; i++) {
      console.log(this.arr[i].shape + ": " + this.arr[i].dimension.start_x + " " + this.arr[i].dimension.start_y);
    }
    */
    console.log("COPY DONE!")
  }

  saveJSON() {   
  
    
  }

  saveXML() {
    /*
    this.paintService.saveAsXML().subscribe(
      (res) => {console.log("DONE SAVING XML!")},
      (error) => {console.log("7az awfr el mara el gaya IN SAVING XML!!")}
      )
      */
  }

  redo() {

  }

  undo() {

  }

}