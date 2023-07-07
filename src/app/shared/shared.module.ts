import { NgModule } from '@angular/core';
import { ResizeColumnDirective } from './resize-column/resize-column.directive';

const DECLARATIONS_EXPORTS: any[] = [ResizeColumnDirective];
const IMPORTS_EXPORTS: any[] = [];
/**
 * Includes all the shared module in app.
 *
 * @date 7/4/2023 - 5:37:28 PM
 */
@NgModule({
  imports: [...IMPORTS_EXPORTS],
  exports: [...IMPORTS_EXPORTS, ...DECLARATIONS_EXPORTS],
  declarations: [...DECLARATIONS_EXPORTS],
})
export class SharedModule {}
