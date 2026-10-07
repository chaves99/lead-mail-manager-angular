import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-campaign-list',
  imports: [
    MatButtonModule,
    MatTableModule,
    DatePipe,
    MatIconModule,
    RouterLink,
    MatMenuModule
  ],
  templateUrl: './campaign-list.html',
})
export class CampaignList implements OnInit {

  displayedColumns = ['id', 'description', 'template_name', 'created_at', 'row_count', 'success', 'failure', 'action'];

  private readonly router = inject(Router);
  private readonly campaignService = inject(CampaignService);
  private readonly snackbar = inject(MatSnackBar);

  lastId = signal<number>(0);

  lastIdHistory: number[] = [0];

  campaignResource = httpResource<CampaignResponse[]>(() => ({
    url: API_URL + `/campaign?lastId=${this.lastId()}`,
    method: 'GET'
  }));

  constructor() {
  }

  ngOnInit(): void {
  }

  onClickTableRow(row: CampaignResponse) {
    this.router.navigate([row.id]);
  }

  onUndo(id: number) {
    this.campaignService.undo(id).subscribe({
      next: () => this.snackbar.open("Campaign undid successfully!", "OK", { duration: 5000 }),
      error: r => {
        this.snackbar.open(`Erro when undo campaign!`, "OK", { duration: 9000, })
      }
    });
  }

  onNextPage() {
    const values = this.campaignResource.value();
    if (values) {
      this.lastId.set(Math.min(...values.map(c => c.id)));
      this.lastIdHistory.push(Math.min(...values.map(c => c.id)));
    }
  }

  onPreviosPage() {
    const length = this.lastIdHistory.length;
    if (length == 0) {
      this.lastIdHistory.push(0);
    } else if (length == 1) {
      this.lastId.set(0);
    } else if (length == 2) {
      this.lastIdHistory.pop();
      const last = this.lastIdHistory[0];
      this.lastId.set(last!);
    } else {
      this.lastIdHistory.pop();
      const last = this.lastIdHistory[this.lastIdHistory.length - 1];
      this.lastId.set(last!);
    }
  }
}

export interface CampaignResponse {
  id: number;
  description: string;
  templateId: number;
  templateName: string;
  rowCount: number;
  createdAt: Date;
  success: number;
  failure: number;
}

