import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Detail } from 'open-factura';
import { FacturadorService } from '../facturador.service';
import { InfoService } from '../info.service';
import { get, ref, remove, set, update } from 'firebase/database';
import { Database, object } from '@angular/fire/database';
import { CarritoPage } from '../carrito/carrito.page';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  constructor(private database:Database,public info: InfoService, private platform: Platform, private router: Router, private menuCtrl: MenuController, private navCtrl: NavController, private vari:CarritoPage) { }
  datos: any[] = [];
  botonPagar:boolean = true;
  carga: boolean = false;
  uid:any;
  carritoNumber:number = 0;
  carritoItems:any[]=[];
  totalPrice:number = 0;
  iva:number = 0;
  finalPrice:number = 0;
  productoString:string = "";
  cedula:string = "";
  nombre:any;
  
  direccion:any;
  correo:any;
  telefono:any;
  retiro:any;
  isModalOpen = false;
  ngOnInit() {
    
  }
  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  toGo(tabName:string){
    this.router.navigate([tabName]);
    this.navCtrl.navigateRoot(tabName);
  }
}
interface datacar {
  cantidad:number,
  nombre:string
}
interface datauser {
  GM: number;
  cantidad: number;
  descripcion: string;
  imagen: string;
  precio: number;
  producto: string;
}