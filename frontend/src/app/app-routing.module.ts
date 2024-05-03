import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as containers from './containers';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: containers.HomeContainer,
  },
  {
    path: 'generate-with-ai',
    component: containers.GenerateWithAiContainer,
  },
  {
    path: 'generate-designs-loading',
    component: containers.GenerateDesignsLoadingContainer,
  },
  {
    path: 'generated-designs-with-ai',
    component: containers.GeneratedDesignsWithAiContainer,
  },
  {
    path: 'test-summary',
    component: containers.TestSummaryContainer,
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
