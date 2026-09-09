import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class TemplateService {

  private readonly http = inject(HttpClient);

  public create(body: TemplateResource): Observable<any> {
    return this.http.post(`${environment.apiUrl}/template`, body);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/template/${id}`);
  }

  public test(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/template/test/${id}`);
  }

  public fetch() {
    return httpResource<TemplateResource[]>(() => ({
      url: `${environment.apiUrl}/template`,
      method: 'GET',
    }));
  }
}

export interface TemplateResource {
  id?: number;
  subject: string;
  body: string;
  name: string;
}

