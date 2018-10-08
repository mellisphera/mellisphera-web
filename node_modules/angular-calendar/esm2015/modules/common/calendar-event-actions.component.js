/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
import { trackByIndex } from './util';
export class CalendarEventActionsComponent {
    constructor() {
        this.trackByIndex = trackByIndex;
    }
}
CalendarEventActionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-event-actions',
                template: `
    <ng-template
      #defaultTemplate
      let-event="event">
      <span *ngIf="event.actions" class="cal-event-actions">
        <a
          class="cal-event-action"
          href="javascript:;"
          *ngFor="let action of event.actions; trackBy:trackByIndex"
          (mwlClick)="action.onClick({event: event})"
          [ngClass]="action.cssClass"
          [innerHtml]="action.label">
        </a>
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event
      }">
    </ng-template>
  `
            }] }
];
CalendarEventActionsComponent.propDecorators = {
    event: [{ type: Input }],
    customTemplate: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    CalendarEventActionsComponent.prototype.event;
    /** @type {?} */
    CalendarEventActionsComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarEventActionsComponent.prototype.trackByIndex;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtYWN0aW9ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9jb21tb24vY2FsZW5kYXItZXZlbnQtYWN0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBMkJ0QyxNQUFNOzs0QkFPVyxZQUFZOzs7O1lBaEM1QixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQlQ7YUFDRjs7O29CQUVFLEtBQUs7NkJBR0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgdHJhY2tCeUluZGV4IH0gZnJvbSAnLi91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWV2ZW50PVwiZXZlbnRcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwiZXZlbnQuYWN0aW9uc1wiIGNsYXNzPVwiY2FsLWV2ZW50LWFjdGlvbnNcIj5cbiAgICAgICAgPGFcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1hY3Rpb25cIlxuICAgICAgICAgIGhyZWY9XCJqYXZhc2NyaXB0OjtcIlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBhY3Rpb24gb2YgZXZlbnQuYWN0aW9uczsgdHJhY2tCeTp0cmFja0J5SW5kZXhcIlxuICAgICAgICAgIChtd2xDbGljayk9XCJhY3Rpb24ub25DbGljayh7ZXZlbnQ6IGV2ZW50fSlcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImFjdGlvbi5jc3NDbGFzc1wiXG4gICAgICAgICAgW2lubmVySHRtbF09XCJhY3Rpb24ubGFiZWxcIj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9XCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckV2ZW50QWN0aW9uc0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHRyYWNrQnlJbmRleCA9IHRyYWNrQnlJbmRleDtcbn1cbiJdfQ==