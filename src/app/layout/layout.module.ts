import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';

/**
 * Main layout definition.
 *
 * @date 7/4/2023 - 5:33:27 PM
 */
@NgModule({
  declarations: [LayoutComponent, NavbarComponent],
  imports: [CommonModule, RouterModule],
})
export class LayoutModule {}
