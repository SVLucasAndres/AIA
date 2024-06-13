import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessPageRoutingModule } from './success-routing.module';

import { SuccessPage } from './success.page';
import { Database } from '@angular/fire/database';
import { CarritoPage } from '../carrito/carrito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessPageRoutingModule,
    
  ],
  providers:[CarritoPage],
  declarations: [SuccessPage]
})
export class SuccessPageModule {}
