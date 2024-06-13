import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardadosPageRoutingModule } from './guardados-routing.module';

import { GuardadosPage } from './guardados.page';
import { QRCodeModule } from 'angularx-qrcode';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardadosPageRoutingModule,
    QRCodeModule
  ],
  providers:[
    File,
    FileTransfer,
    AndroidPermissions
  ],
  declarations: [GuardadosPage]
})
export class GuardadosPageModule {}
