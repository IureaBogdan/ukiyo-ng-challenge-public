import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employees } from './types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private readonly _http: HttpClient) {}

  /**
   * Fetch the employees data.
   *
   * @date 7/4/2023 - 5:23:51 PM
   *
   * @param {?string} [filterByName] The employee name to filter by.
   */
  fetchEmployees(filterByName?: string | null): Observable<Employees> {
    const req$ = this._http.get<Employees>('/assets/employees.json');
    let employees$ = req$;

    // Check if a filter is provided or is empty
    if (filterByName) {
      employees$ = req$.pipe(
        map((employees) => filterEmployeesRec(employees, filterByName))
      );
    }

    return employees$;
  }
}

const filterEmployeesRec = (employees: Employees, name: string) => {
  const empWithChildren = employees.filter((emp) => !!emp.children);

  // Recursive search in children nodes
  let recSearchResult: any[] = empWithChildren.map((emp) => {
    const childrenSearchResult = filterEmployeesRec(emp.children ?? [], name);

    return childrenSearchResult.length > 0
      ? {
          ...emp,
          children: childrenSearchResult,
        }
      : null;
  });

  // Remove nulls in the recursive search
  recSearchResult = recSearchResult.filter((result) => result !== null);

  // Search in the current node
  let srchResultCntNode = employees.filter((emp) =>
    emp.name.toUpperCase().includes(name.toUpperCase())
  );

  // Remove the current node's children
  srchResultCntNode = srchResultCntNode.map((emp) => {
    const empCopy = { ...emp };
    delete empCopy.children;
    return empCopy;
  });

  // Remove duplicate employees and keep only the ones with nested found names
  const removedDupCrntNode = srchResultCntNode.filter(
    (emp) => !recSearchResult.some((empWChld) => empWChld.name === emp.name)
  );

  // Spread result
  return [...removedDupCrntNode, ...recSearchResult];
};
