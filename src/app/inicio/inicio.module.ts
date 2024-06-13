import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';
import { QRCodeModule } from 'angularx-qrcode';
import Swiper from 'swiper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    QRCodeModule
  ],
  declarations: [InicioPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioPageModule {}
