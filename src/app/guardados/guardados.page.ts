import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Database, object } from '@angular/fire/database';
import { endAt, orderByChild, orderByKey, query, ref, startAt } from 'firebase/database';
import { Observable, map } from 'rxjs';
import { Browser } from '@capacitor/browser';
import {AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.page.html',
  styleUrls: ['./guardados.page.scss'],
})
export class GuardadosPage implements OnInit {
  async manual() {
    await Browser.open({ url: 'https://wa.me/593990586160' });
  };
  fact:boolean = true;
  datos: any[] = [];
  carga: boolean = false;
  private menuAbierto = false;
  uid:any;
  carritoNumber:number = 0;
  pedidos:any[] = [];
  constructor(private androidPermissions: AndroidPermissions,private http: HttpClient,private database:Database,public info: InfoService, private platform: Platform, private router: Router, private menuCtrl: MenuController, private navCtrl: NavController, private store:AngularFireStorage,private file: File, private transfer: FileTransfer) { }
  refFile(filePath: string): Observable<string> {
    const fileRef = this.store.ref(filePath);
    return fileRef.getDownloadURL();
  }
  async downloadFile(nombre:any) {
    const filePath = 'facturas/'+nombre+'.pdf'; // Cambia esto por el path de tu archivo en Firebase Storage
    await this.refFile(filePath).subscribe(async url => {
      await Browser.open({ url:url });
    }, (error) => {
      console.error('Error descargando archivo', error);
    });
  }
  
  ngOnInit() {
    this.info.getUid().subscribe(async res => {
      if (res != null) {
        this.datos = await this.info.obtenerBDD('UID', res?.uid);
        this.uid = await res?.uid;
        this.carga = true;
        console.log('clients/' + this.uid + '/carrito');
        const route = await ref(this.database, 'clients/'+this.uid+'/carrito');
        
        await object(ref(this.database,'pedidos')).subscribe(attributes =>{
          this.pedidos = [];
          attributes.snapshot.forEach(element=>{
            if(element.key.substring(0,28) == this.uid){
              const data = element.val() as pedido;
              const state = data.estado;
              const price = data.precio;
              const prod = data.reserva.substring(0,data.reserva.length);
              const ci = data.factura.id;
              const cus = data.factura.cliente;
              const method = data.factura.metodo;
              const qr = element.key;
              const fecha = data.fecha;
              let color;
              if(state == "Por reservar"){
                color = 'warning';
                this.fact = true;
              }else if(state == "Listo"){
                color = 'success';
                this.fact = false;
              }else if(state == "Cancelado"){
                color = 'danger';
                this.fact = true;
              }else if(state == "Completado"){
                color = 'dark';
                this.fact = false;
              }
              this.pedidos.push({state,price,prod,ci,cus,color,method,qr,fecha});
            }else{
              console.log("no");
            }
          })
        })
        object(route).subscribe(attributes => {
          this.carritoNumber = 0;
          const carritoData = attributes.snapshot.val();
          if (carritoData) {
            console.log(carritoData);
            for (const key in carritoData) {
              if (carritoData.hasOwnProperty(key)) {
                const dato = carritoData[key] as datacar;
                const cuant = dato.cantidad;
                console.log(cuant);
                this.carritoNumber += cuant;
                console.log(this.carritoNumber);
              }
            }
            
          } else {
            console.log('No hay datos en el carrito');
          }
        });
        this.carga = false;
      } else {
        this.info.irA('/home');
      }
    });

  }
  toGo(tabName:string){
    this.router.navigate([tabName]);
    this.navCtrl.navigateRoot(tabName);
  }
  abrirMenu() {
    this.info.toggleMenu();
  }

  esAndroid() {
    return this.platform.is('android');
  }
}
interface datacar {
  cantidad:number,
  nombre:string
}
interface pedido {
  factura:{
    celular:string,
    cliente:string,
    direccion:string,
    id:string,
    mail:string,
    metodo:string,
    tipoId:string
  }
  estado:string,//
  precio:string,//
  reserva:string,//
  retiro:string,//
  fecha:string,//
}