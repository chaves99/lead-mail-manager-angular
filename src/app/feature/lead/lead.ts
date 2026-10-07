import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CompanyEmailFilter, ExecuteCampaignButton, FilterFormModel } from '../../shared';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-search',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CompanyEmailFilter,
    ExecuteCampaignButton,
    MatProgressBarModule,
    MatMenuModule
  ],
  templateUrl: './lead.html',
})
export class Lead {

  private readonly snackbar = inject(MatSnackBar);
  private readonly http = inject(HttpClient);

  emailSearchFilter = signal<EmailSearchFilter>({
    emailExclude: [],
    emailInclude: [],
    lastIndex: 0,
    pageSize: 100,
    companyPerEmail: 1,
  });
  lastIdHistory: number[] = [0];

  emailsResource = httpResource<EmailSearchResponse>(() => ({
    url: API_URL + '/lead/search',
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

  onDelete(id: number) {
    console.log("trying to delete: " + id);
    this.http.delete(`${API_URL}/lead/${id}`).subscribe({
      next: () => {
        this.snackbar.open("Excluido com sucesso!", "OK", { duration: 4000 });
        this.emailsResource.reload();
      },
      error: () => {
        this.snackbar.open("Erro ao excluir!", "OK", { duration: 4000 });
      }
    });
  }

}

interface EmailSearchResponse {
  total: number;
  list: { id: number, email: string }[];
}

export interface EmailSearchFilter {
  lastIndex: number;
  pageSize: number;
  emailExclude: string[];
  emailInclude: string[];
  companyPerEmail?: number;
}
