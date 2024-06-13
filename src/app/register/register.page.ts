import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit';
import { Flip } from 'gsap/all';
import { NavController } from '@ionic/angular';
import { Firestore } from '@angular/fire/firestore';
import { InfoService } from '../info.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class REGISTERPage implements OnInit {
  user:string="";
  pass:string="";
  correo:any;
  birth:any;
  carga:boolean=false;
  readonly options: MaskitoOptions = maskitoDateOptionsGenerator({ mode:'dd/mm/yyyy', separator:'/'});
  constructor(private info:InfoService,private route:NavController, private db:Firestore) { }

  ngOnInit() {
    this.animateBox();
  }
  animateBox() {
    gsap.to(".register", {
      duration: 1,
      opacity: 1,
      stagger: 0.2,
      y: 50,
      ease: "elastic.out(1,0.3)",
      force3D: true
    });
    
  }
  
  async register(){
    if(this.user==null || this.pass==null || this.birth==null || this.correo==null){
      this.info.presentToast("Por favor, complete todos los elementos",'bottom');
    }else{
      try{
        this.carga=true;
        const res = await this.info.registrar(this.correo, this.pass);
        await res.user?.sendEmailVerification();
        console.log(res.user?.uid);
        await this.info.agregarBDD("Registros",res.user?.uid,{UID:res.user?.uid, mail:res.user?.email,user:this.user,fechaNacimiento:this.birth});
        this.carga=false;
        this.info.irA('home');
        this.info.presentAlert('Usuario registrado exitosamente','Verifica tu correo electrónico para acceder a tu cuenta la próxima vez',['OK']);
      }catch{
        this.info.presentToast("Este usuario ya existe",'bottom');
        this.carga=false;
      }
      
    }
  }
  State() {
    this.info.irA('home');
  }
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
}
