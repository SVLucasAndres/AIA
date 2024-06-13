import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletionPageRoutingModule } from './deletion-routing.module';

import { DeletionPage } from './deletion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletionPageRoutingModule
  ],
  declarations: [DeletionPage]
})
export class DeletionPageModule {}
