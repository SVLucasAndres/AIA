import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { REGISTERPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: REGISTERPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class REGISTERPageRoutingModule {}
