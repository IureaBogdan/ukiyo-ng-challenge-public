import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  EmployeeModel,
  EmployeesModels,
  SelectionByLevel,
  SelectionByLevel as SelectionByTblLvl,
} from '../types';

type ceva = {
  currentSelectionByLvl: SelectionByLevel[];
  currentTable: SelectionByLevel | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class EmployeesTableService {
  /**
   * Indicates if any row or sub level row has been selected.
   *
   * @date 7/6/2023 - 2:17:25 PM
   */
  private _anyRowSelected = new BehaviorSubject<boolean>(false);

  /**
   * Stores all the selected rows by level.
   *
   * @date 7/6/2023 - 2:17:25 PM
   */
  private _selectedRowsByLvl = new BehaviorSubject<SelectionByTblLvl[]>([]);

  public get anyRowSelected$() {
    return this._anyRowSelected.asObservable();
  }

  public addOneSelectionByLvl(tableId: number, selection: EmployeeModel) {
    const { currentSelectionByLvl, currentTable } =
      this.getTableAndSelectionByLevel(tableId);

    let next: SelectionByTblLvl[];
    // If the current table selection does not exist, create it.
    if (!currentTable) {
      next = [
        ...currentSelectionByLvl,
        {
          tableId,
          selection: [selection],
        },
      ];
    } else {
      //If the selection already exists, remove it from the current selection and update it.
      const currentTblIdx = currentSelectionByLvl.indexOf(currentTable);
      currentSelectionByLvl.splice(currentTblIdx, 1);

      next = [
        ...currentSelectionByLvl,
        {
          tableId,
          selection: [...currentTable.selection, selection],
        },
      ];
    }
    this._selectedRowsByLvl.next(next);
    this._anyRowSelected.next(true);
  }

  public removeOneSelectionByLvl(tableId: number, selection: EmployeeModel) {
    const { currentSelectionByLvl, currentTable } =
      this.getTableAndSelectionByLevel(tableId);

    if (currentTable) {
      // Remove the current table selection from the behaviour subject value.
      const currentTblIdx = currentSelectionByLvl.indexOf(currentTable);
      currentSelectionByLvl.splice(currentTblIdx, 1);

      // Remove the selection from the table selection
      const rowIdx = currentTable.selection.indexOf(selection);
      currentTable.selection.splice(rowIdx, 1);

      // Create the next selection state and check if the current table level
      // should be added to it (it should not be added if the selection array is empty).
      const next =
        currentTable.selection.length === 0
          ? [...currentSelectionByLvl]
          : [
              ...currentSelectionByLvl,
              {
                tableId,
                selection: [...currentTable.selection],
              },
            ];

      this._selectedRowsByLvl.next(next);
      if (next.length === 0) {
        this._anyRowSelected.next(false);
      }
    }
  }

  public addAllSelectionsByLvl(tableId: number, selection: EmployeesModels) {
    const { currentSelectionByLvl, currentTable } =
      this.getTableAndSelectionByLevel(tableId);

    if (currentTable) {
      // Remove the current table selection from the behaviour subject value.
      const currentTblIdx = currentSelectionByLvl.indexOf(currentTable);
      currentSelectionByLvl.splice(currentTblIdx, 1);
    }

    // Create a new table level selection with all the rows.
    const newTableSelection = {
      tableId,
      selection: [...selection],
    };

    const next = [...currentSelectionByLvl, newTableSelection];
    this._selectedRowsByLvl.next(next);
    this._anyRowSelected.next(true);
  }

  public removeAllSelectionsByLvl(tableId: number) {
    const { currentSelectionByLvl, currentTable } =
      this.getTableAndSelectionByLevel(tableId);

    if (currentTable) {
      // Remove the current table selection from the behaviour subject value.
      const currentTblIdx = currentSelectionByLvl.indexOf(currentTable);
      currentSelectionByLvl.splice(currentTblIdx, 1);

      const next = [...currentSelectionByLvl];

      this._selectedRowsByLvl.next(next);
      if (next.length === 0) {
        this._anyRowSelected.next(false);
      }
    }
  }

  private getTableAndSelectionByLevel(tableId: number): ceva {
    const currentSelectionByLvl = this._selectedRowsByLvl.value;
    const currentTable = currentSelectionByLvl.find(
      (current) => current.tableId === tableId
    );
    return { currentSelectionByLvl, currentTable };
  }
}
