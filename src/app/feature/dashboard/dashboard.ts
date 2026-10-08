import { DecimalPipe, PercentPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    DecimalPipe,
    PercentPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalsResource = httpResource<LeadTotalDashboard>(() => ({
    url: `${API_URL}/lead/dashboard`,
    method: 'GET',
  }));

  totalsResponse: LeadTotalDashboard | undefined = httpResource<LeadTotalDashboard>(() => ({
    url: `${API_URL}/lead/dashboard`,
    method: 'GET',
  })).value();

  ngOnInit(): void {
  }

  public calcPercentage(whole: number, part: number): number {
    return part / whole;
  }
}


interface LeadTotalDashboard {
  registered: number;
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  unreachable: number;
}
