import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import metadata from 'libphonenumber-js/min/metadata';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import{ maskitoPhoneOptionsGenerator} from '@maskito/phone'
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  readonly options1: MaskitoOptions = maskitoPhoneOptionsGenerator({ countryIsoCode:'EC',metadata,separator:' ',strict:true});
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
  constructor(public info:InfoService,private navCtrl: NavController,
    private platform: Platform,
    private router: Router) { }
  datos:any[]=[];
  carga:boolean=false;
  async ngOnInit() {
    this.info.getUid().subscribe(async res => {
      if (res != null && res.uid) {
        this.datos = await this.info.obtenerBDD('UID', res.uid);
        if (this.datos && this.datos.length >= 8) {
          this.tipoID = this.datos[3];
          this.ID = this.datos[4];
          this.razonSocial = this.datos[6];
          this.telefono = this.datos[5];
          this.direccion = this.datos[7];
        } else {
          // Handle case where datos does not have expected structure
          this.info.presentToast("Datos incompletos recibidos", 'top', 'warning', 'warning');
        }
      } else {
        this.info.irA('/home');
      }
    }, error => {
      console.error("Error fetching UID:", error);
      this.info.irA('/home');
    });
  }
  
  async cerrarsesion(){
    this.carga = true;
    await this.info.cerrarSesion();
    this.carga = false;
  }
  isModalOpen = false;
  async setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  tipoID:string = this.datos[3];
  ID:any= this.datos[4];
  razonSocial:any= this.datos[6];
  telefono:any= this.datos[5];
  direccion:any= this.datos[7];
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
  uid:any;
  
  async update(){
    if(await this.tipoID==null || this.ID==null || this.direccion==null || this.telefono == null || this.razonSocial==null){
      this.info.presentToast("Por favor, complete todos los elementos",'top','warning','warning');
    }else{
      if(!(this.verificarcedula(this.ID)) && (this.tipoID!='Pasaporte')){
        this.info.presentToast("Identificación incorrecta",'top','warning','warning');
      }else if(!((this.ID).endsWith('001')) && (this.tipoID=='RUC')){
        this.info.presentToast("RUC incorrecto",'top','warning','warning');
      }else{
        try{
          this.info.getUid().subscribe(async res => {
            if (await res != null) {
              this.datos = await this.info.obtenerBDD('UID', res?.uid);
              this.uid = await res?.uid;
              
            } else {
              this.toGo('home');
            }
          });
          this.carga=true;
          await this.info.actualizarBDD("Registros",this.uid,{TipoID: this.tipoID, Identificacion: this.ID,Direccion: this.direccion,Celular: this.telefono ,RazonSocial: this.razonSocial});
          this.carga=false;
          this.setOpen(false);
          this.info.presentToast('Información actualizada correctamente','top','success','checkmark');
        }catch(err:any){
          this.info.presentToast('Ha ocurrido un error. Inténtalo de nuevo','top','danger','close');
          console.log(err);
          this.carga=false;
        }
          
      }
    }
  }
  toGo(tabName: string) {
    this.router.navigate([tabName]);
    this.navCtrl.navigateRoot(tabName);
  }
}
