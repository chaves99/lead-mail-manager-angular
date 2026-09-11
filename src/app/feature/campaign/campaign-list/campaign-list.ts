import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  imports: [
    MatButtonModule,
    MatTableModule,
    DatePipe,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './campaign-list.html',
})
export class CampaignList implements OnInit {

  displayedColumns = ['id', 'description', 'template_name', 'created_at', 'row_count', 'success', 'failure'];

  readonly router = inject(Router);
  campaignResource = httpResource<CampaignResponse[]>(() => ({
    url: API_URL + "/campaign",
    method: 'GET'
  }));

  ngOnInit(): void {
  }

  onClickTableRow(row: CampaignResponse) {
    this.router.navigate([row.id]);
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

