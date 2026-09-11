import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailSearchFilter } from '../email-search/email-search';

@Service()
export class CampaignService {

  private readonly http = inject(HttpClient);

  public executeCampaign(body: CampaignExecution): Observable<any> {
    return this.http.post(`${API_URL}/campaign`, body);
  }
}

export interface CampaignExecution {
  description: string;
  templateId: number;
  limit?: number;
  filter: EmailSearchFilter;
}
