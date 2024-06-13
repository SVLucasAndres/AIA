import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecucontraPageRoutingModule } from './recucontra-routing.module';

import { RecucontraPage } from './recucontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecucontraPageRoutingModule
  ],
  declarations: [RecucontraPage]
})
export class RecucontraPageModule {}
