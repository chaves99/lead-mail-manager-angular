import { httpResource } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './dashboard.html'
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
}


interface LeadTotalDashboard {
  registered: number;
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}
