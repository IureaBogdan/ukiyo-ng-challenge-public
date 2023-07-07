export interface IEmployee {
  name: string;
  type: string;
  email: string;
  phoneNo: string;
  companyName: string;
  address: string;
  children?: IEmployee[];
}

export type EmployeeModel = IEmployee & {
  collapsed: boolean;
  selected: boolean;
};

export type EmployeesModels = EmployeeModel[];

export type Employees = IEmployee[];

export type SelectionByLevel = {
  tableId: number;
  selection: EmployeesModels;
};

export type TData = {
  employees: Employees;
  collapse: boolean;
};
