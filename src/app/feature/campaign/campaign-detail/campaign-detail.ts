import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-campaign-detail',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './campaign-detail.html',
})
export class CampaignDetail implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  readonly location = inject(Location);

  private campaignId = signal<number>(-1);

  campaignResource = httpResource<CampaignDetailResponse>(() => ({
    url: API_URL + "/campaign/" + this.campaignId(),
    method: 'GET'
  }));

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(value => {
      const id = value['id'];
      this.campaignId.set(id);
    })
  }

}

interface CampaignDetailResponse {
  campaign: {
    id: number;
    description: string;
    createdAt: Date;
    rowCount: number;
  };
  templateName: string;
  rowsTotal: {
    pending: number;
    delivered: number;
    bounced: number;
    complained: number;
    unknowError: number;
    opened: number;
    clicked: number;
  }
}
