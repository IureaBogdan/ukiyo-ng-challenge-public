import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChallengeRoutingModule } from './challenge-routing.module';
import { ChallengeComponent } from './challenge/challenge.component';
import { EmployeesTableComponent } from './employees-table/employees-table.component';

@NgModule({
  declarations: [ChallengeComponent, EmployeesTableComponent],
  imports: [
    CommonModule,
    ChallengeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbCollapseModule,
  ],
})
export class ChallengeModule {}
