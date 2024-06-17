import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import{ maskitoPhoneOptionsGenerator} from '@maskito/phone'
import { MaskitoDateMode, maskitoDateOptionsGenerator, maskitoNumberOptionsGenerator } from '@maskito/kit';
import { Flip } from 'gsap/all';
import metadata from 'libphonenumber-js/min/metadata';
import { NavController } from '@ionic/angular';
import { Firestore } from '@angular/fire/firestore';
import { InfoService } from '../info.service';
import { object } from '@angular/fire/database';
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

  tipoID:any;
  ID:any;
  razonSocial:any;
  telefono:any;
  direccion:any;

  carga:boolean=false;
  readonly options: MaskitoOptions = maskitoDateOptionsGenerator({ mode:'dd/mm/yyyy', separator:'/'});
  readonly options1: MaskitoOptions = maskitoPhoneOptionsGenerator({ countryIsoCode:'EC',metadata,separator:' ',strict:true});
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
    if(await this.user==null || this.pass==null || this.birth==null || this.correo==null || this.tipoID==null || this.ID==null || this.direccion==null || this.telefono == null || this.razonSocial==null){
      this.info.presentToast("Por favor, complete todos los elementos",'bottom');
    }else{
      if(!(this.verificarcedula(this.ID)) && (this.tipoID!='Pasaporte')){
        this.info.presentToast("Identificación incorrecta",'bottom');
      }else{
        try{
          this.carga=true;
          const res = await this.info.registrar(this.correo, this.pass);
          await res.user?.sendEmailVerification();
          console.log(res.user?.uid);
          await this.info.agregarBDD("Registros",res.user?.uid,{UID:res.user?.uid, mail:res.user?.email,user:this.user,fechaNacimiento:this.birth,TipoID: this.tipoID,Identificacion: this.ID,Direccion: this.direccion,Celular: this.telefono ,RazonSocial: this.razonSocial});
          this.carga=false;
          this.info.irA('home');
          this.info.presentAlert('Usuario registrado exitosamente','Verifica tu correo electrónico para acceder a tu cuenta la próxima vez',['OK']);
        }catch(err:any){
          if(err.code == 'auth/weak-password'){
            this.info.presentToast('Tu contraseña debe ser de al menos 6 caracteres','bottom');
          }else if(err.code == 'auth/email-already-in-use'){
            this.info.presentToast('Este usuario ya existe','bottom');
          }
          this.carga=false;
        }
          
      }
    }
  }
  State() {
    this.info.irA('home');
  }
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
  verificarcedula(cedula:string){
    let val=0;
    for(let i = 0;i<9;i++){
      const j = parseInt(cedula.charAt(i));
      
      if(i%2!=0){
        val += j;
      }else{
        if(j*2 > 9){
          val += j*2 - 9;
        }else{
          val += j*2;
        }
      }
    }
    if(10 - val%10 == parseInt(cedula.charAt(9))){
      return true;
    }else if(val%10 == 0 && parseInt(cedula.charAt(9))==0){
      return true;
    }else{
      return false;
    }
  }
}
