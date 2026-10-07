import { Component, output, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-company-email-filter',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './company-email-filter.html',
})
export class CompanyEmailFilter {

  filterOutput = output<FilterFormModel>();

  accordion = viewChild.required(MatAccordion);

  filterFormModel: FilterFormModel = {
    lastIndex: 0,
    pageSize: 10,
    emailExclude: [],
    emailInclude: [],
  };

  constructor() {
  }

  applyFilter(): void {
    this.accordion().closeAll();
    this.filterOutput.emit(this.filterFormModel);
  }

  onSelectPageSize(event: MatSelectChange<any>) {
    const pageSize = event.value as number;
    this.filterFormModel.pageSize = pageSize;
  }

  // ###################################
  // ###### EMAIL FILTER METHODS #######
  // ###################################

  onRemoveEmailIncludeKeyword(keyword: string) {
    const keywords = this.filterFormModel.emailInclude;
    const index = keywords.indexOf(keyword);
    if (index >= 0) {
      keywords.splice(index, 1);
      this.filterFormModel.emailInclude = [...keywords];
    }

  }

  onRemoveEmailExcludeKeyword(keyword: string) {
    const keywords = this.filterFormModel.emailExclude;
    const index = keywords.indexOf(keyword);
    if (index >= 0) {
      keywords.splice(index, 1);
      this.filterFormModel.emailExclude = [...keywords];
    }

  }

  onAddEmailExcludeKeyword(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.filterFormModel.emailExclude = [...this.filterFormModel.emailExclude, value];
    }
    event.chipInput.clear();
  }

  onAddEmailIncludeKeyword(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.filterFormModel.emailInclude = [...this.filterFormModel.emailInclude, value];
    }
    event.chipInput.clear();
  }

}

export interface FilterFormModel {
  lastIndex: number;
  pageSize: number;
  emailExclude: string[];
  emailInclude: string[];
  sentQuantity?: number;
  shouldFetchUnsubscribed?: boolean;
}
