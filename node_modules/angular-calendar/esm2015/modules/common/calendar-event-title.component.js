/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
export class CalendarEventTitleComponent {
}
CalendarEventTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-event-title',
                template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-view="view">
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle:view:event">
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }">
    </ng-template>
  `
            }] }
];
CalendarEventTitleComponent.propDecorators = {
    event: [{ type: Input }],
    customTemplate: [{ type: Input }],
    view: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    CalendarEventTitleComponent.prototype.event;
    /** @type {?} */
    CalendarEventTitleComponent.prototype.customTemplate;
    /** @type {?} */
    CalendarEventTitleComponent.prototype.view;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBd0I5RCxNQUFNOzs7WUFyQkwsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQlQ7YUFDRjs7O29CQUVFLEtBQUs7NkJBR0wsS0FBSzttQkFHTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci1ldmVudC10aXRsZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtZXZlbnQ9XCJldmVudFwiXG4gICAgICBsZXQtdmlldz1cInZpZXdcIj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50LXRpdGxlXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTp2aWV3OmV2ZW50XCI+XG4gICAgICA8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgIHZpZXc6IHZpZXdcbiAgICAgIH1cIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRXZlbnRUaXRsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIHZpZXc6IHN0cmluZztcbn1cbiJdfQ==