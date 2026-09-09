import { AsyncPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, output, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
    AsyncPipe
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './company-email-filter.html',
  styleUrl: './company-email-filter.css',
})
export class CompanyEmailFilter {

  filterOutput = output<FilterFormModel>();

  accordion = viewChild.required(MatAccordion);

  filterFormModel: FilterFormModel = {
    lastIndex: 0,
    pageSize: 10,
    emailExclude: [],
    emailInclude: [],
    fantasyNameExclude: [],
    fantasyNameInclude: [],
    cnae: []
  };

  cnaeAutoCompleteControl = new FormControl();
  cnaeResource = httpResource<Cnae[]>(() => ({
    url: environment.apiUrl + "/cnae",
    method: 'GET'
  }));
  cnaeFilteredOption: Observable<Cnae[]>;

  constructor() {
    this.cnaeFilteredOption = this.cnaeAutoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        if (name) {
          return this._filter(name as string);
        }
        if (this.cnaeResource.hasValue()) {
          return this.cnaeResource.value();
        }

        return [];
      }),
    );
  }

  private _filter(value: string): Cnae[] {
    const filterValue = value.toLowerCase();
    if (this.cnaeResource.hasValue())
      return this.cnaeResource.value().filter(option => option.description.toLowerCase().includes(filterValue));
    return [];
  }

  applyFilter(): void {
    this.accordion().closeAll();
    this.filterOutput.emit(this.filterFormModel);
  }

  onUpdateMotherBranch(motherBranch: number) {
    this.filterFormModel.motherBranchId = motherBranch;
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

  // ###################################
  // ### FANTASY NAME FILTER METHODS ###
  // ###################################

  onRemoveFantasyNameIncludeKeyword(keyword: string) {
    const keywords = this.filterFormModel.fantasyNameInclude;
    const index = keywords.indexOf(keyword);
    if (index >= 0) {
      keywords.splice(index, 1);
      this.filterFormModel.fantasyNameInclude = [...keywords];
    }

  }

  onRemoveFantasyNameExcludeKeyword(keyword: string) {
    const keywords = this.filterFormModel.fantasyNameExclude;
    const index = keywords.indexOf(keyword);
    if (index >= 0) {
      keywords.splice(index, 1);
      this.filterFormModel.fantasyNameExclude = [...keywords];
    }

  }

  onAddFantasyNameExcludeKeyword(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.filterFormModel.fantasyNameExclude = [...this.filterFormModel.fantasyNameExclude, value];
    }
    event.chipInput.clear();
  }

  onAddFantasyNameIncludeKeyword(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.filterFormModel.fantasyNameInclude = [...this.filterFormModel.fantasyNameInclude, value];
    }
    event.chipInput.clear();
  }

  onAddCnae(cnae: Cnae) {
    this.filterFormModel.cnae = [...this.filterFormModel.cnae, cnae];
    this.cnaeAutoCompleteControl.patchValue('');
  }

  onRemoveCnaeChip(code: number) {
    this.filterFormModel.cnae = this.filterFormModel.cnae.filter(c => c.code !== code);
  }
}

export interface FilterFormModel {
  lastIndex: number;
  pageSize: number;
  emailExclude: string[];
  emailInclude: string[];
  fantasyNameExclude: string[];
  fantasyNameInclude: string[];
  cnae: Cnae[];
  motherBranchId?: number;
  sentQuantity?: number;
}

export interface Cnae {
  code: number;
  description: string;
}
