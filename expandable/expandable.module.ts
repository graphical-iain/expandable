import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AdditionalButton, CollapsedComponent, ExpandedComponent, TriggerComponent, TrunkExpandableComponent } from './expandable.component';

@NgModule({
  declarations: [
    TrunkExpandableComponent,
    ExpandedComponent,
    CollapsedComponent,
    TriggerComponent,
    AdditionalButton,
  ],
  imports: [CommonModule, MatButtonModule],
  exports: [
    TrunkExpandableComponent,
    ExpandedComponent,
    CollapsedComponent,
    AdditionalButton,
    TriggerComponent,
  ],
})
export class TrunkExpandableModule {}
