import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecucontraPage } from './recucontra.page';

const routes: Routes = [
  {
    path: '',
    component: RecucontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecucontraPageRoutingModule {}
