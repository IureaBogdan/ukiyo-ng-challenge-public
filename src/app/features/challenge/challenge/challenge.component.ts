import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, merge, Observable, switchMap } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { TData } from '../types';

@Component({
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  selector: 'app-challenge',
})
export class ChallengeComponent implements OnInit {
  public tData$!: Observable<TData>;
  public searchFormCtrl = new FormControl('');
  constructor(private readonly _employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.tData$ = this.initTableData();
  }

  private fetchEmployees(filterByName?: string | null) {
    return this._employeeService.fetchEmployees(filterByName);
  }

  private initTableData() {
    const search$ = this.searchFormCtrl.valueChanges.pipe(
      // Set debounce time to the search field
      debounceTime(2000),
      // Cancel the previous search (if any) and start a new one.
      switchMap((value) => {
        return this.fetchEmployees(value).pipe(
          map((employees) => {
            // Map the data to TableData type.
            return {
              employees,
              collapse: value ? false : true,
            };
          })
        );
      })
    );

    // Get the initial data.
    const initialEmployees$ = this.fetchEmployees().pipe(
      map((employees) => {
        return {
          employees,
          collapse: true,
        };
      })
    );
    // Merge the initial data stream and the search stream.
    return merge(initialEmployees$, search$);
  }
}
