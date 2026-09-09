import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { environment } from '../../../environments/environment';
import { CompanyEmailFilter, ExecuteCampaignButton, FilterFormModel } from '../../shared';
import { TemplateService } from '../template';

@Component({
  selector: 'app-company',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DecimalPipe,
    MatProgressSpinner,
    CompanyEmailFilter,
    ExecuteCampaignButton,
  ],
  templateUrl: './company.html',
})
export class Company implements OnInit {

  private readonly templateService = inject(TemplateService);

  templatesFetch = this.templateService.fetch();

  displayedColumns: string[] = ['id', 'cnpj', 'fantasy_name', 'email'];

  history: number[] = [];

  filter = signal<FilterFormModel>({
    lastIndex: 0,
    pageSize: 10,
    emailExclude: [],
    emailInclude: [],
    fantasyNameExclude: [],
    fantasyNameInclude: [],
    cnae: []
  });
  companyResource = httpResource<CompanyResponse>(() => ({
    url: environment.apiUrl + "/company",
    method: 'POST',
    body: this.filter(),
  }));

  ngOnInit(): void {
  }

  onNextPage() {
    const value = this.companyResource.value();
    if (value && value.companies) {
      const lastId = value.companies[value.companies.length - 1].id
      this.history.push(lastId);
      this.filter.update(f => {
        f.lastIndex = lastId;
        return f;
      });
    }
  }

  onPreviousPage() {
    const historySize = this.history.length;
    let newLastIndex = 0;

    if (historySize === 2) {
      this.history.pop();
    } else if (historySize >= 3) {
      this.history.pop();
      const item = this.history[this.history.length - 1];
      newLastIndex = item;
    }

    this.filter.update(f => {
      f.lastIndex = newLastIndex;
      return f;
    });
  }

  applyFilter(filter: FilterFormModel): void {
    this.filter.set(filter);
    this.companyResource.reload();
  }
}

export interface CompanyResponse {
  companies: CompanyModel[];
  total: number;
}

export interface CompanyModel {
  id: number;
  cnpj: number;
  email: string;
  fantasyName: string;
}

