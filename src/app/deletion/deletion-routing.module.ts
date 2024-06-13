import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletionPage } from './deletion.page';

const routes: Routes = [
  {
    path: '',
    component: DeletionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletionPageRoutingModule {}
