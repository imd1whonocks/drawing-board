# [Drawing Board](https://github.com/imd1whonocks/drawing-board) 
#### Hosted [here](https://drawing-board.imd1whonocks.com/) 
###### drawing-board.imd1whonocks.com
---
Drawing board can be implemented using both svg and canvas. SVG has DOM-like elements and Canvas has Javascript Drawing API. This project contain both of these implementations.
- SVG drawing board can be accessed at `/svg` path.
- Canvas drawing board can be accessed at `/canvas` path.  
Board also works on phones and tablets.
*By default SVG drawing board is opened at `/`*.

---
## Tools
1. `Pen`: Makes permanent strokes with different width like 1, 3, 5 px.
2. `Highlighter`: Make a stroke with width 5px and color opacity of 50%. It gets removed from canvas when user draw next stroke. 
3. `Eraser`: Make strokes which removes the drawing part. *Default eraser width is 15px.*
4. `Color picker tool`: Color of pen and highlighter stroke can be choosen. It can be different for different stroke.
---
## Available Scripts
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.<br>
The build is minified and the filenames include the hashes.