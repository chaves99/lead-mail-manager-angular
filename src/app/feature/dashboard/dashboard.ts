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
    PercentPipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalsResource = httpResource<TotalDashboard>(() => ({
    url: `${API_URL}/lead/dashboard`,
    method: 'GET',
  }));

  totalsResponse: TotalDashboard | undefined = httpResource<TotalDashboard>(() => ({
    url: `${API_URL}/lead/dashboard`,
    method: 'GET',
  })).value();

  ngOnInit(): void {
    console.log(this.totalsResource.value());
  }

  public calcPercentage(whole: number, part: number): number {
    return part / whole;
  }
}


interface TotalDashboard {
  leads: LeadsTotal;
  emails: EmailsTotal;
}

interface LeadsTotal {
  totalLeads: number;
  emailed: number;
  totalOpened: number;
  totalClicked: number;
  leadsOpened: number;
  leadsClicked: number;
  unsubscribed: number;
  unreachable: number;
}

interface EmailsTotal {
  total: number;
  pending: number;
  success: number;
  error: number;
  clicked: number;
  opened: number;
}
