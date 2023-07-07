import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appResizeColumn]',
})
export class ResizeColumnDirective implements AfterViewInit, OnDestroy {
  @Input()
  public maxWidth!: string;

  @Input()
  public minWidth: string = '150px';

  private readonly listeners: (() => void)[] = [];
  constructor(
    private readonly _el: ElementRef,
    private readonly _renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.addResizerToHeadings();
  }

  ngOnDestroy(): void {
    // Make sure that the listeners are being unsubscribed.
    this.listeners.forEach((cbk) => cbk());
  }

  private addResizerToHeadings() {
    // Get the table row that contains the headings.
    const [headingsRow]: [HTMLTableRowElement] =
      this._el.nativeElement.children;

    // Get the th elements.
    const tableHeadings = headingsRow.children;

    for (let i = 0; i < tableHeadings.length; i++) {
      const th: Element = tableHeadings[i];
      const thDiv = th.children[0];

      if (this.maxWidth) {
        this._renderer.setStyle(thDiv, 'max-width', this.maxWidth);
      }
      this._renderer.setStyle(thDiv, 'min-width', this.minWidth);

      thDiv.append(...this.createResizerContainers(thDiv));
    }
  }

  /**
   * Creates left and right resizers.
   */
  private createResizerContainers(parent: any) {
    /* NOTE - The resizer class is imported globally from assets/resizer.ts */
    // Helper function that creates a div with the resizer-left or resizer-right css class.
    const createResizer = (placement: 'left' | 'right') => {
      const resizer: HTMLDivElement = this._renderer.createElement('div');
      this._renderer.addClass(resizer, `resizer-${placement}`);

      // Set the height to match the one of the column.
      this._renderer.setStyle(resizer, 'height', '100%');
      return resizer;
    };

    const resizerLeft = createResizer('left');
    this.createResizableColumn(parent, resizerLeft, 'left');

    const resizerRight = createResizer('right');
    this.createResizableColumn(parent, resizerRight, 'right');

    return [resizerLeft, resizerRight];
  }

  /**
   * Creates the listeners for resizable columns.
   */
  createResizableColumn(
    parent: any,
    resizer: HTMLElement,
    position: 'left' | 'right'
  ) {
    let mouseX: number;
    let divWidth: number;
    const resizingListeners: (() => void)[] = [];

    const mouseDownHandler = (event: MouseEvent) => {
      // While mouse down, set the background to the one in hover pseudo class.
      const style = getComputedStyle(resizer, ':hover');
      this._renderer.setStyle(resizer, 'background', style.background);

      // Get the current mouse position.
      mouseX = event.clientX;

      // Get the current width of column
      const { width } = getComputedStyle(parent);
      divWidth = parseInt(width, 10);

      // Create listeners for the mouse move/up events (while mouse down).
      const mMoveListener = this._renderer.listen(
        'document',
        'mousemove',
        mouseMoveHandler
      );
      const mUpListener = this._renderer.listen(
        'document',
        'mouseup',
        mouseUpHandler
      );

      // Store the unsubscribe listeners.
      resizingListeners.push(mMoveListener, mUpListener);
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      // Determine how far the mouse has been moved based on position.
      const distance =
        event.clientX > mouseX
          ? event.clientX - mouseX
          : mouseX - event.clientX;

      // Update the width of column based on position
      if (position === 'left') {
        const width =
          event.clientX > mouseX ? divWidth - distance : divWidth + distance;
        parent.style.width = `${width}px`;
      } else {
        const width =
          event.clientX > mouseX ? divWidth + distance : divWidth - distance;
        parent.style.width = `${width}px`;
      }
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = () => {
      this._renderer.removeStyle(resizer, 'background');
      resizingListeners.forEach((cbk) => cbk());
    };

    const mDownListener = this._renderer.listen(
      resizer,
      'mousedown',
      mouseDownHandler
    );
    this.listeners.push(mDownListener);
  }
}
