import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { REGISTERPageRoutingModule } from './register-routing.module';

import { REGISTERPage } from './register.page';
import { MaskitoDirective } from '@maskito/angular';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    REGISTERPageRoutingModule,
    MaskitoDirective
  ],
  declarations: [REGISTERPage],
  
})
export class REGISTERPageModule {}
