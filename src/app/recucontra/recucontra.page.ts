import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit';
import { Flip } from 'gsap/all';
import { NavController } from '@ionic/angular';
import { InfoService } from '../info.service';
@Component({
  selector: 'app-recucontra',
  templateUrl: 'recucontra.page.html',
  styleUrls: ['recucontra.page.scss'],
})
export class RecucontraPage implements AfterViewInit {
  user:any;
  carga:boolean=false;
  constructor(private route:NavController, private info:InfoService) {}
  async ngAfterViewInit() {
    this.animateBox();
  }



  animateBox() {
    gsap.to(".login", {
      duration: 1,
      opacity: 1,
      stagger: 0.2,
      y: 50,
      ease: "elastic.out(1,0.3)",
      force3D: true
    });
    
  }
  async olvideContra(){
    if(!(this.user=='')){
      this.carga=true;
      await this.info.olvideContra(this.user);
      this.carga=false;
      this.info.irA('home');
      this.info.presentAlert('¡Éxito!','El e-mail se envió, recupera tu contraseña',['OK']);
    }else{
      this.info.presentToast('Por favor, ingresa el correo','top');
    }
  }
}