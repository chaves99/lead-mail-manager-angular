import { Routes } from '@angular/router';
import { EmailSearch } from './feature/email-search/email-search';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'email-search',
    pathMatch: 'full'
  },
  {
    path: 'email-search',
    component: EmailSearch
  },
  {
    path: 'template',
    loadComponent: () => import('./feature/template/').then(m => m.Template)
  },
  {
    path: 'campaign',
    loadComponent: () => import('./feature/campaign/').then(m => m.CampaignList)
  },
  // {
  //   path: 'campaign/:id',
  //   loadComponent: () => import('./feature/campaign/').then(m => m.CampaignDetail)
  // },
];

