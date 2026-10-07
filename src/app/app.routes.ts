import { Routes } from '@angular/router';
import { Lead } from './feature/lead/lead';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'email-search',
    component: Lead
  },
  {
    path: 'template',
    loadComponent: () => import('./feature/template/').then(m => m.Template)
  },
  {
    path: 'campaign',
    loadComponent: () => import('./feature/campaign/').then(m => m.CampaignList)
  },
  {
    path: 'campaign/:id',
    loadComponent: () => import('./feature/campaign/').then(m => m.CampaignDetail)
  },
];

