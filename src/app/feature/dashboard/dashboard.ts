import { DecimalPipe, PercentPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TemplateService } from '../template';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    PercentPipe,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  templateResource = inject(TemplateService).fetch();

  totalsResourceParamsValue = signal<number>(0);
  totalsResource = httpResource<TotalDashboard>(() => ({
    url: `${API_URL}/lead/dashboard`,
    method: 'GET',
    params: {
      'templateId': this.totalsResourceParamsValue()
    }
  }));


  ngOnInit(): void {
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
