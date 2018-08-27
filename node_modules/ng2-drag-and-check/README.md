# ng2-drag-and-check
(https://www.npmjs.com/package/ng2-drag-and-check)  
Angular directive (for version >= 2.x ) that makes the DOM element draggable, with additional checks on out of bounds elements.  
All credits should go to xieziyu for his ground work.

## Table of contents 
1. [Getting Started](#getting-started)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API](#api)
6. [Events](#events)

# Getting Started
ng2-drag-and-check is an angular (ver >= 2.x) directive that makes the DOM element draggable. (Note that: It's different from drag-and-drop)

# Latest Update
+ 2017.12.10: packaging with ng-packagr and unit tests

# Installation
```
npm install ng2-drag-and-check --save
```


# Usage
Please refer to the original [demo](https://xieziyu.github.io/#/angular2-draggable/demo) page.

1. Firstly, import `DragAndCheckModule` in your app module (or any other proper angular module):
    ```typescript
    import { DragAndCheckModule } from 'ng2-drag-and-check';

    @NgModule({
      imports: [
        ...,
        DragAndCheckModule
      ],
      ...
    })
    export class AppModule { }
    ```

2. Then: use `ngDraggable` directive to make the DOM element draggable.
    + Simple example:

      + html:
      ```html
      <div ngDraggable>Drag me!</div>
      ```

    + Use `[handle]` to move parent element:

      + html:
      ```html
      <div ngDraggable [handle]="DemoHandle" class="card">
        <div #DemoHandle class="card-header">I'm handle. Drag me!</div>
        <div class="card-block">You can't drag this block now!</div>
      </div>
      ```

# API

## Directive:
`ngDraggable` directive support following input properties:
+ `ngDraggable`: boolean. You can toggle the draggable capability by setting `true`/`false` to `ngDraggable`

+ `handle`: HTMLElement. Use template variable to refer to the handle element. Then only the handle element is draggable.

+ `allowedOffsets` : DragAndCheckModule.Offsets. Defines the behavior of the directive when the dragged element reaches the borders of the page. See below.

## Offsets:
Defines limits for the dragging in the 4 directions.  

  constructor(  
  private top: any = Offsets.NONE,  
  private right: any = Offsets.NONE,  
  private bottom: any = Offsets.NONE,  
  private left: any = Offsets.NONE)  
  
Values can be either :
+ numbers. Defines a 'margin' in px from the border of the viewport. Dragging is forbidden past this margin.  
Ex:  `top: 50` will define a 50px margin from the top of the screen. The margin goes from the border to the center of the page.
  + A positive margin will restrict event more than the border of the screen
  + A zero margin will use the border of the screen as the limit
  + A negative margin will allow the dragging past the border of the screen.

+ constants, provided by Offsets :
  + `Offsets.NONE` : no limits, default value
  + `Offsets.BORDER` : uses the border of the screen. Equivalent to `0`
  + `Offsets.HALF_WIDTH` : allows half of the dragged object to go past the screen (in the horizontal direction. To be used for `left` and `right` offsets)
  + `Offsets.HANDLE` : the handle must stay on screen. The rest of the content is free. (mainly used for `bottom`).

## CSS:
When `ngDraggable` is enabled on some element, `ng-draggable` class is automatically assigned to it. You can use it to customize the pointer style. For example:

```css
.ng-draggable {
  cursor: move;
}
```

# Events

Support `started` and `stopped` events. The `nativeElement` of the host would be emitted.

+ Simple example:
  + html:
  ```html
  <div ngDraggable (started)="onDragBegin($event)" (stopped)="onDragEnd($event)">Drag me!</div>
  ```
