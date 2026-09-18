import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { CampaignService } from '../campaign.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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


  campaignResource = httpResource<CampaignResponse[]>(() => ({
    url: API_URL + "/campaign",
    method: 'GET'
  }));

  ngOnInit(): void {
  }

  onClickTableRow(row: CampaignResponse) {
    this.router.navigate([row.id]);
  }

  onUndo(id: number) {
    this.campaignService.undo(id).subscribe({
      next: () => this.snackbar.open("Campaign undid successfully!", "OK", { duration: 5000 }),
      error: r => {
        console.log(r);
        this.snackbar.open(`Erro when undo campaign!`, "OK", { duration: 9000, })
      }
    });
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

