import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { EmployeeModel, Employees, EmployeesModels, TData } from '../types';
import { EmployeesTableService } from './employees-table.service';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesTableComponent implements OnDestroy {
  /**Indicates if the table is the the first level one. */
  @Input()
  public isFirstLevel: boolean = true;

  @Input('tData')
  public set setTableData(data: TData | null) {
    if (!data) return;

    this.shouldCollapseAll = data.collapse;
    this.employees = data.employees;
    this.employeeModels = this.employees.map((employee) => ({
      ...employee,
      collapsed: this.shouldCollapseAll,
      selected: false,
    }));
  }

  public shouldCollapseAll: boolean = false;

  public anySelected$ = this._employeeTableSvc.anyRowSelected$;

  public allSelected: boolean = false;

  public employees!: Employees | null;
  public employeeModels!: EmployeesModels | null;

  public headers = ['Name', 'Type', 'Email', 'Phone Number', 'Company Name'];

  /**
   * Field that helps to keep track of the selected rows by table level.
   *
   * @date 7/6/2023 - 2:16:01 PM
   */
  private tableId: number = Math.floor(Math.random() * 1_000_000_000);

  constructor(private _employeeTableSvc: EmployeesTableService) {}

  public selectOne(employeeModel: EmployeeModel) {
    // If all checkboxes are selected and the current selction
    // is false, then uncheck the master checkbox.
    if (this.allSelected && !employeeModel.selected) {
      this.allSelected = false;
    }

    // Check the master checkbox if all the rows were selected individually.
    const allSelectedIndividualClick = !this.employeeModels?.some(
      (employeeModel) => employeeModel.selected === false
    );

    if (allSelectedIndividualClick) {
      this.allSelected = true;
    }

    // Update the selection state based on current selection.
    if (employeeModel.selected) {
      this._employeeTableSvc.addOneSelectionByLvl(this.tableId, employeeModel);
    } else {
      this._employeeTableSvc.removeOneSelectionByLvl(
        this.tableId,
        employeeModel
      );
    }
  }

  /**
   * Handler for the master checkbox selection change.
   */
  public selectAll() {
    // If all selected, set the employee selected field to true.
    if (this.allSelected === true) {
      this.employeeModels?.forEach((em) => {
        em.selected = true;
      });
      // Update the selection state.
      this._employeeTableSvc.addAllSelectionsByLvl(
        this.tableId,
        this.employeeModels ?? []
      );
      return;
    }

    // Otherwise, set the field to false.
    this.employeeModels?.forEach((em) => {
      em.selected = false;
    });

    // Update the selection state.
    this._employeeTableSvc.removeAllSelectionsByLvl(this.tableId);
  }

  ngOnDestroy(): void {
    // When the component is removed, unset the employee models.
    // This way, when a high level row closses, the next level rows remain closed.
    // We can also obtain the same behavior by iterating over the
    // employee models and setting the collapsed field to true.
    this.employeeModels = null;

    // Remove any selection data from the state management service
    this._employeeTableSvc.removeAllSelectionsByLvl(this.tableId);
  }
}
