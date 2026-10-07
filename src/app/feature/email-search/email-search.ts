import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CompanyEmailFilter, ExecuteCampaignButton, FilterFormModel } from '../../shared';

@Component({
  selector: 'app-email-search',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CompanyEmailFilter,
    ExecuteCampaignButton,
    MatProgressBarModule,
  ],
  templateUrl: './email-search.html',
  styleUrl: './email-search.css',
})
export class EmailSearch {

  emailSearchFilter = signal<EmailSearchFilter>({
    emailExclude: [],
    emailInclude: [],
    lastIndex: 0,
    pageSize: 100,
    companyPerEmail: 1,
  });

  lastIdHistory: number[] = [0];

  emailsResource = httpResource<EmailSearchResponse>(() => ({
    url: API_URL + '/lead',
    method: 'POST',
    body: this.emailSearchFilter(),
  }));

  onApplyFilter(filter: FilterFormModel): void {
    this.emailSearchFilter.update(() => {
      return { ...filter, companyPerEmail: this.emailSearchFilter().companyPerEmail };
    });
    this.emailsResource.reload();
  }

  onNextPage() {
    const values = this.emailsResource.value();
    if (values && values.list) {
      const minId = Math.max(...values.list.map(c => c.id));
      this.updateFilterLastIndex(minId);
      this.lastIdHistory.push(minId);
    }
  }

  onPreviosPage() {
    const length = this.lastIdHistory.length;
    if (length == 0) {
      this.lastIdHistory.push(0);
    } else if (length == 1) {
      this.updateFilterLastIndex(0);
    } else if (length == 2) {
      this.lastIdHistory.pop();
      const last = this.lastIdHistory[0];
      this.updateFilterLastIndex(last);
    } else {
      this.lastIdHistory.pop();
      const last = this.lastIdHistory[this.lastIdHistory.length - 1];
      this.updateFilterLastIndex(last);
    }
  }

  private updateFilterLastIndex(index: number) {
    this.emailSearchFilter.update(filter => {
      return { ...filter, lastIndex: index };
    });
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
  companyPerEmail?: number;
}
