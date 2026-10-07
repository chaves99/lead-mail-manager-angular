import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailSearchFilter } from '../lead/lead';

@Service()
export class CampaignService {

  private readonly http = inject(HttpClient);

  public executeCampaign(body: CampaignExecution): Observable<any> {
    return this.http.post(`${API_URL}/campaign`, body);
  }

  public undo(id: number) {
    return this.http.put(`${API_URL}/campaign/${id}/undo`, {});
  }
}

export interface CampaignExecution {
  description: string;
  templateId: number;
  limit?: number;
  filter: EmailSearchFilter;
}
