import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { AlertController, MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { get, ref, remove, set, update } from 'firebase/database';
import { Database, object } from '@angular/fire/database';
import { NgModel } from '@angular/forms';
import {Browser} from '@capacitor/browser';
import { totalPrice, iva, finalPrice } from '../global'; // Importar las variables globales

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  datos: any[] = [];
  botonPagar:boolean = true;
  carga: boolean = false;
  private menuAbierto = false;
  uid:any;
  carritoNumber:number = 0;
  carritoItems:any[]=[];
  totalPrice:number = 0;
  iva:number = 0;
  finalPrice:number = 0;
  productoString:string = "";
  cedula:string = "";
  nombre:any;
  method:any;
  direccion:any;
  correo:any;
  telefono:any;
  retiro:any;
  isModalOpen = false;
  constructor(private alert:AlertController,private database:Database,public info: InfoService, private platform: Platform, private router: Router, private menuCtrl: MenuController, private navCtrl: NavController) { }
  async manual() {
    await Browser.open({ url: 'https://able-duckling-809.notion.site/CARLA-tu-asistente-virtual-para-ni-os-con-S-ndrome-de-Down-4567f96b3dd54d988bae669b77230216?pvs=25' });
  };
  async setOpen(isOpen: boolean, content?:any) {
    this.isModalOpen = isOpen;
  }
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
  pagar(){
    this.info.preparePayment(this.totalPrice, this.finalPrice,this.generateRandomId(15)).subscribe(
      (respuesta) => {
        window.location.href = respuesta.payWithCard;
        

        // Verificar si los parámetros están presentes
        
      },
      (error) => {
        alert('Error en la llamada: ' + error);
      }
    );
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
  async pay() {
    const billingData = {
      cedula: this.cedula,
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      direccion: this.direccion
    };
    
    this.info.presentAlertInput(
      'Paso 1',
      'Ingresa tus datos de facturación (No nos responsabilizamos de información falsa)',
      [
        {
          text: 'Salir',
          handler: () => {
            console.log("canceló");
          }
        },
        {
          text: 'Siguiente',
          handler: (data: any) => {
            billingData.cedula = data[0];
            billingData.nombre = data[1];
            billingData.correo = data[2];
            billingData.telefono = data[3];
            billingData.direccion = data[4];
            
            
            if (
              !billingData.cedula ||
              !billingData.nombre ||
              !billingData.correo ||
              !billingData.telefono ||
              !billingData.direccion
              
              
            ) {
              this.info.presentToast('Todos los campos son obligatorios', 'top', 'warning', 'alert');
              
            }else if(!this.verificarcedula(billingData.cedula)){
              this.info.presentToast('Cédula incorrecta', 'top', 'warning', 'alert');
            }
              else{
              this.info.presentAlertInput(
                'Paso 2',
                'Retiro del producto',
                [
                  {
                    text: 'Salir',
                    handler: () => {
                      console.log("canceló");
                    }
                  },
                  {
                    text: 'Siguiente',
                    handler: (data: any) => {
                      if(data){
                        if(data == 'Retiro'){
                          this.info.presentAlertInput(
                            'Paso 3',
                            'Método de pago',
                            [
                              {
                                text: 'Salir',
                                handler: () => {
                                  console.log("canceló");
                                }
                              },
                              {
                                text: 'Siguiente',
                                handler: (data: any) => {
                                  if(data){
                                    this.method = data;
                                    if(data == 'Efectivo'){
                                      set(ref(this.database,'clients/'),{});
                                      const code = this.generateRandomId(12);
                                      for(const item of this.carritoItems){
                                        this.productoString += item.cuant+ ' ' + item.name;
                                      }
                                      const fecha = new Date().toLocaleDateString();
                                      console.log("Code: "+code+'Productos: '+this.productoString);
                                      set(ref(this.database,'pedidos/'+ this.uid + code),{estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , cliente: billingData.nombre, cedula: billingData.cedula, metodo: data, direccion: billingData.direccion, celular:billingData.telefono, mail:billingData.correo, fecha:fecha});
                                      this.info.presentAlert('Proceso finalizado','Desde que el estado de tu orden sea Listo, estará reservada por 5 días. Acude al taller de Asistencia Integral Automotriz para retirarla y emitir la factura. Debes mostrar el código QR del pedido en la sección "Mis pedidos". ¡Gracias por tu compra!',[
                                        {
                                          text:'Aceptar',
                                          handler:() => {
                                            this.toGo('guardados');
                                          }
                                        }
                                      ])
                                    }else if(data == 'Transferencia'){
                                      set(ref(this.database,'clients/'),{});
                                      const code = this.generateRandomId(12);
                                      for(const item of this.carritoItems){
                                        this.productoString += item.cuant + ' ' + item.name + ', ';
                                        const route1 = ref(this.database, 'productos');
                                        const subscription = object(route1).subscribe(async attributes => {
                                          this.carritoItems= [];
                                          attributes.snapshot.forEach(element => {
                                            const dato = element.val() as datauser;
                                            const cantidad = dato.cantidad - item.cuant;
                                            if(item.name == dato.producto){
                                              console.log("cantidad: " + cantidad);
                                              update(ref(this.database,'productos/'+item.name),{cantidad: cantidad})
                                            }
                                          });
                                          subscription.unsubscribe();
                                          
                                        });
                                      }
                                      const fecha = new Date().toLocaleDateString();
                                      console.log("Code: "+code+'Productos: '+this.productoString);
                                      set(ref(this.database,'pedidos/'+ this.uid + code),{estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , cliente: billingData.nombre, cedula: billingData.cedula, metodo: data, direccion: billingData.direccion, celular:billingData.telefono, mail:billingData.correo, fecha:fecha});
                                      
                                      this.info.presentAlert('Proceso finalizado','Debes realizar la transferencia y subir el comprobante en el apartado de "Mis pedidos". Tu producto está reservado desde ahora por 5 días. Si no realizas la transferencia en ese lapso, tu pedido será cancelado. Cuando el estado del pedido sea Listo, podrás retirar tu producto en el taller de Asistencia Integral Automotriz. ¡Gracias por tu compra!',[
                                        {
                                          text:'Aceptar',
                                          handler:() => {
                                            this.toGo('guardados');
                                          }
                                        }
                                      ])
                                    }else{
                                      this.setOpen(true);
                                    }
                                  }else{
                                    this.info.presentToast('Debes seleccionar una opción de pago', 'top', 'warning', 'alert');
                                  }
                                }
                              }
                            ],
                            [
                              {
                                value: 'Efectivo',
                                type: 'radio',
                                label: 'En efectivo (Al retirar del local)'
                                
                              },
                              {
                                value: 'Transferencia',
                                type: 'radio',
                                label: 'Por transferencia (Banco Pichincha)'
                              },
                              {
                                value: 'Tarjeta de Crédito',
                                type: 'radio',
                                label: 'En línea (Tarjeta de Crédito)'
                              },
                              {
                                value: 'Tarjeta de Débito',
                                type: 'radio',
                                label: 'En línea (Tarjeta de Débito)'
                              }
                            ]
                          );
                        }else{
                          this.info.presentAlertInput(
                            'Paso 3',
                            'Método de pago',
                            [
                              {
                                text: 'Salir',
                                handler: () => {
                                  console.log("canceló");
                                }
                              },
                              {
                                text: 'Siguiente',
                                handler: (data1: any) => {
                                  if(data1){
                                    if(data1=='Transferencia'){
                                      this.info.presentAlertInput('Paso 3.1: Ubicación','Copia el enlace de tu ubicación de Google Maps. Haz clic en ayuda para ver un video.',[
                                        {
                                          text: 'Salir',
                                          handler: ()=>{
                                            console.log('canceló');
                                          },
                                        },
                                        
                                        {
                                          text: 'Ayuda',
                                          handler: ()=>{
                                            this.manual();
                                          },
                                        },
                                        {
                                          text: 'Siguiente',
                                          handler: (data:any)=>{
                                            if(data){
                                              set(ref(this.database,'clients/'+this.uid),{});
                                              const code = this.generateRandomId(12);
                                              for(const item of this.carritoItems){
                                                this.productoString += item.cuant + ' ' + item.name + ', ';
                                                const route1 = ref(this.database, 'productos');
                                                const subscription = object(route1).subscribe(async attributes => {
                                                  this.carritoItems= [];
                                                  attributes.snapshot.forEach(element => {
                                                    const dato = element.val() as datauser;
                                                    const cantidad = dato.cantidad - item.cuant;
                                                    if(item.name == dato.producto){
                                                      console.log("cantidad: " + cantidad);
                                                      update(ref(this.database,'productos/'+item.name),{cantidad: cantidad})
                                                    }
                                                  });
                                                  subscription.unsubscribe();
                                                  
                                                });
                                              }
                                              const fecha = new Date().toLocaleDateString();
                                              console.log("Code: "+code+'Productos: '+this.productoString);
                                              set(ref(this.database,'pedidos/'+ this.uid + code),{estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , cliente: billingData.nombre, cedula: billingData.cedula, metodo: data1, direccion: billingData.direccion, celular:billingData.telefono, mail:billingData.correo, fecha:fecha});
                                              this.info.presentAlert('Proceso finalizado','Debes realizar la transferencia y subir el comprobante en el apartado de "Mis pedidos". Tu producto está reservado desde ahora por 5 días. Si no realizas la transferencia en ese lapso, tu pedido será cancelado. Cuando el estado del pedido sea Listo, tu pedido estará en camino a la dirección dada. ¡Gracias por tu compra!',[
                                                {
                                                  text:'Aceptar',
                                                  handler:() => {
                                                    this.toGo('guardados');
                                                  }
                                                }
                                              ])
                                            }else{
                                              this.info.presentToast('Debes ingresar la ubicación', 'top', 'warning', 'alert');
                                            }
                                          },
                                        },
                                      ],[
                                        {
                                          type: 'textarea',
                                          placeholder: 'https://maps.app.goo.gl/XXXXXXXXXXXXXXXXX'
                                        }
                                      ]);
                                    }else{
                                      this.setOpen(true);
                                    }
                                  }else{
                                    this.info.presentToast('Debes seleccionar una opción de pago', 'top', 'warning', 'alert');
                                  }
                                }
                              }
                            ],
                            [
                              {
                                value: 'Transferencia',
                                type: 'radio',
                                label: 'Por transferencia (Banco Pichincha)'
                              },
                              {
                                value: 'Payphone',
                                type: 'radio',
                                label: 'Con tarjeta (PayPhone)'
                              }
                            ]
                          );
                        }
                      }else{
                        this.info.presentToast('Debes seleccionar una opción', 'top', 'warning', 'alert');
                      }
                    }
                  }
                ],
                [
                  {
                    value: 'Dentro Cuenca',
                    type: 'radio',
                    label: 'Envío dentro del cantón Cuenca'
                  },
                  {
                    value: 'Fuera Cuenca',
                    type: 'radio',
                    label: 'Envío fuera del cantón Cuenca'
                  },
                  {
                    value: 'Retiro',
                    type: 'radio',
                    label: 'Retirar en el local'
                  }
                ]
              );
            }
            
          }
        }
      ],
      [
        {
          placeholder: 'Cédula',
          attributes: { maxlength: 10 , minlength:10},
          value: billingData.cedula
        },
        {
          placeholder: 'Razón Social',
          value: billingData.nombre
        },
        {
          placeholder: 'Correo electrónico',
          value: billingData.correo
        },
        {
          placeholder: 'Celular',
          value: billingData.telefono
        },
        {
          placeholder: 'Dirección',
          value: billingData.direccion
        }
      ]
    );
  }
  
  presentAlertBill(){
    const billingData = {
      cedula: this.cedula,
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      direccion: this.direccion,
      method: this.method
    };
    this.info.presentAlertInput(
      'Paso Extra',
      'Ingresa tus datos de facturación nuevamente para su confirmación',
      [
        {
          text: 'Siguiente',
          handler: (data: any) => {
            billingData.cedula = data[0];
            billingData.nombre = data[1];
            billingData.correo = data[2];
            billingData.telefono = data[3];
            billingData.direccion = data[4];
            billingData.method = data[5];
            if((billingData.method=='Crédito' || billingData.method == 'Débito')){
              this.info.presentAlert('¡Exito!','Si tienes que ir a retirar el pedido, espera a que tu orden se encuentre en estado "Listo" y podrás ir a retirarlo. Si pediste envío, espera a que tu orden se encuentre en estado "Listo" y a que te llegue un mensaje con las indicaciones por WhatsApp. Puedes saber si tu pedido está Listo cuando recibas la factura de tu compra',['OK'])
            set(ref(this.database,'clients/'),{});
            const code = this.generateRandomId(12);
            for(const item of this.carritoItems){
              this.productoString += item.cuant + ' ' + item.name + ', ';
              const route1 = ref(this.database, 'productos');
              const subscription = object(route1).subscribe(async attributes => {
                this.carritoItems= [];
                attributes.snapshot.forEach(element => {
                  const dato = element.val() as datauser;
                  const cantidad = dato.cantidad - item.cuant;
                  if(item.name == dato.producto){
                    console.log("cantidad: " + cantidad);
                    update(ref(this.database,'productos/'+item.name),{cantidad: cantidad})
                  }
                });
                subscription.unsubscribe();
                
              });
            }
            console.log("Code: "+code+'Productos: '+this.productoString);
            const fecha = new Date().toLocaleDateString();
            console.log("fecha: "+fecha);
            set(ref(this.database,'pedidos/'+ this.uid + code),{estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , cliente: billingData.nombre, cedula: billingData.cedula, metodo: billingData.method, direccion: billingData.direccion, celular:billingData.telefono, mail:billingData.correo, fecha:fecha});
            }else{
              this.info.presentToast('El tipo de tarjeta es incorrecto (Débito/Crédito)','top','danger','close-circle-outline');
              this.presentAlertBill();
            }
          }
        }
    ],
    [
      {
        placeholder: 'Cédula',
        attributes: { maxlength: 10 , minlength:10},
        value: billingData.cedula
      },
      {
        placeholder: 'Razón Social',
        value: billingData.nombre
      },
      {
        placeholder: 'Correo electrónico',
        value: billingData.correo
      },
      {
        placeholder: 'Celular',
        value: billingData.telefono
      },
      {
        placeholder: 'Dirección',
        value: billingData.direccion
      },
      {
        placeholder: 'Tipo de tarjeta (Crédito/Débito)',
        value:billingData.method,
      }
    ])
    
  }
  ngOnInit() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const successId = urlParams.get('id');
    const clientTransactionId = urlParams.get('clientTransactionId');
    if (successId && clientTransactionId) {
      this.presentAlertBill();
    }
    this.updateGlobalVariables();
    this.carga=true;
    this.info.getUid().subscribe(async res => {
      if (res != null) {
        
        this.datos = await this.info.obtenerBDD('UID', res?.uid);
        this.uid = await res?.uid;
        this.carga = true;
        console.log('clients/' + this.uid + '/carrito');
        const route = await ref(this.database, 'clients/'+this.uid+'/carrito');
        this.carritoItems = [];
        object(route).subscribe(attributes => {
          this.carritoNumber = 0;
          this.carritoItems = [];
          const carritoData = attributes.snapshot.val();
          if (carritoData) {
            console.log(carritoData);
            for (const key in carritoData) {
              if (carritoData.hasOwnProperty(key)) {
                const dato = carritoData[key] as datacar;
                const cuant = dato.cantidad;
                const name = dato.nombre;
                this.totalPrice = 0;
                object(ref(this.database,'productos')).subscribe(async attributes => {
                  await attributes.snapshot.forEach(element => {
                    
                    const dato1 = element.val() as datauser;
                    const product = dato1.producto;
                    const precio = dato1.precio * cuant;
                    
                    if(product == name){
                      this.carritoNumber += cuant;
                      this.carritoItems.push({cuant,name,precio});
                      this.totalPrice += parseFloat(precio.toFixed(2));
                      this.iva = parseFloat((this.totalPrice * 0.15).toFixed(2));
                      this.finalPrice = parseFloat((this.totalPrice + this.iva).toFixed(2));
                      this.updateGlobalVariables();
                    }
                  });
                });
                
                this.botonPagar = false;
                this.carga=false;
              }
            }
            
          } else {
            console.log('No hay datos en el carrito');
            this.carritoItems= [];
            this.carga=false;
            this.totalPrice = 0;
            this.iva = 0;
            this.finalPrice = 0;
            this.botonPagar = true;
          }
        });
      } else {
        this.info.irA('/home');
        this.carga=false;
      }
    });
    
  }
  private updateGlobalVariables() {
    (window as any).totalPrice = this.totalPrice;
    (window as any).iva = this.iva;
    (window as any).finalPrice = this.finalPrice;
  }
  async delAll(product:any){
    this.carga=true;
    const route = ref(this.database, 'clients/' + this.uid + '/carrito');
    const carritoSnapshot = await get(route);
    const carritoData = carritoSnapshot.val();
    this.carritoItems = [];
    if (carritoData) {
      const dato = carritoData[product] as datacar;
      this.carritoItems = [];
      await remove(ref(this.database, 'clients/' + this.uid + '/carrito/' + product));
    } else {
      console.log('No hay datos en el carrito');
      this.carritoItems = [];
    }
    this.carga=false;
  }
  async delOne(product: any) {
    this.carga=true;
    const route = ref(this.database, 'clients/' + this.uid + '/carrito');
    const carritoSnapshot = await get(route);
    const carritoData = carritoSnapshot.val();
    
    if (carritoData) {
      this.carritoItems = [];
      const dato = carritoData[product] as datacar;
      this.carritoItems = [];
      if (dato && dato.cantidad > 0) {
        const newCantidad = dato.cantidad - 1;
        if (newCantidad > 0) {
          await update(ref(this.database, 'clients/' + this.uid + '/carrito/' + product), { cantidad: newCantidad });
          this.carritoItems = [];
        } else {
          await remove(ref(this.database, 'clients/' + this.uid + '/carrito/' + product));
          this.carritoItems = [];
        }
      }
    } else {
      console.log('No hay datos en el carrito');
      this.carritoItems = [];
    }
    this.carga=false;
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
interface datauser {
  GM: number;
  cantidad: number;
  descripcion: string;
  imagen: string;
  precio: number;
  producto: string;
}