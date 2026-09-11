import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class TemplateService {

  private readonly http = inject(HttpClient);

  public create(body: TemplateResource): Observable<any> {
    return this.http.post(`${API_URL}/template`, body);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/template/${id}`);
  }

  public test(id: number): Observable<any> {
    return this.http.get(`${API_URL}/template/test/${id}`);
  }

  public fetch() {
    return httpResource<TemplateResource[]>(() => ({
      url: `${API_URL}/template`,
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

