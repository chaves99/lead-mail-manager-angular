import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../../environments/environment';
import { Cnae, CompanyEmailFilter, ExecuteCampaignButton, FilterFormModel } from '../../shared';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-email-search',
  imports: [
    MatListModule,
    MatIconModule,
    CompanyEmailFilter,
    ExecuteCampaignButton,
    MatProgressBarModule,
  ],
  templateUrl: './email-search.html',
  styleUrl: './email-search.css',
})
export class EmailSearch {

  emailSearchFilter = signal<EmailSearchFilter>({
    cnae: [],
    fantasyNameExclude: [],
    fantasyNameInclude: [],
    emailExclude: [],
    emailInclude: [],
    lastIndex: 0,
    pageSize: 100,
    companyPerEmail: 1,
  });

  emailsResource = httpResource<EmailSearchResponse>(() => ({
    url: environment.apiUrl + '/lead',
    method: 'POST',
    body: this.emailSearchFilter(),
  }));

  onApplyFilter(filter: FilterFormModel): void {
    this.emailSearchFilter.update(f => {
      return { ...filter, companyPerEmail: this.emailSearchFilter().companyPerEmail };
    });
    this.emailsResource.reload();
  }

}

interface EmailSearchResponse {
  total: number;
  list: { id: number, email: string, count: number }[];
}

export interface EmailSearchFilter {
  lastIndex: number;
  pageSize: number;
  emailExclude: string[];
  emailInclude: string[];
  fantasyNameExclude: string[];
  fantasyNameInclude: string[];
  cnae: Cnae[];
  motherBranchId?: number;
  companyPerEmail?: number;
}
