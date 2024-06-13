import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit';
import { Flip } from 'gsap/all';
import { NavController } from '@ionic/angular';
import { InfoService } from '../info.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  user:any;
  pass:any;
  carga:boolean=false;
  constructor(private route:NavController, private info:InfoService) {}
  
  async ngAfterViewInit() {
    this.animateBox();
    this.carga=true;
    this.info.getUid().subscribe(async res => {
      if(res!=null){
        await this.info.login(this.user,this.pass).then(Verificado => {
          this.info.irA('inicio');
        }, error =>{

        });
      }
    });
    this.carga=false;
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
  async login(){
    await this.info.login(this.user,this.pass).then(Verificado => {
      this.info.irA('inicio');
    }, error =>{
      this.info.presentAlert("Credenciales incorrectas o no verificado","¿Son tus credenciales correctas? ¿Verificaste tu cuenta?",["Dame un momento"]);
    });
  }
  State() {
    this.route.navigateRoot('register');
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
}
