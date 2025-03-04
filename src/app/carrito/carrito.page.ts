import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfoService } from '../info.service';
import { Storage } from '@ionic/storage';
import { AlertController, MenuController, NavController, Platform} from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { get, ref, remove, set, update } from 'firebase/database';
import { Database, object } from '@angular/fire/database';
import { NgModel } from '@angular/forms';
import {Browser} from '@capacitor/browser';
import { totalPrice, iva, finalPrice } from '../global'; // Importar las variables globales
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  datos: any[] = [];
  botonPagar:boolean = true;
  carga: boolean = false;

  menuAbierto:boolean = false;
  uid:any;
  imageUrl:any = "-";
  terms:boolean=false;
  carritoNumber:number = 0;
  carritoItems:any[]=[];
  totalPrice:number = 0;
  iva:number = 0;
  finalPrice:number = 0;
  productoString:string = "";
  checkout:boolean = false;
  cedula:string = "";
  nombre:any;
  method:any;
  direccion:any;
  correo:any;
  telefono:any;
  retiro:any;
  isModalOpen = false;
  constructor(private http: HttpClient,private storage:Storage,private store:AngularFireStorage,private alert:AlertController,private database:Database,public info: InfoService, private platform: Platform, private router: Router, private menuCtrl: MenuController, private navCtrl: NavController) { }
  enviarPedido(productosPedido: { nombre: string, cantidad: number }[] | string, cliente: string = "Cliente Anónimo", cedula: string = "N/A", celular: string = "N/A", retiro: string = "N/A", metodo: string = "N/A", imag:string = "No hay imagen") {
    
    const datosPedido = {
      cliente: cliente,
      productos: productosPedido,
      cedula:cedula,
      celular:celular,
      retiro:retiro,
      metodo:metodo,
      imag:imag,
    };
    if(metodo = "Tarjeta Crédito/Débito"){
      const apiUrl ='https://aia-1hto.onrender.com/send-email-card';
      this.http.post(apiUrl, datosPedido).subscribe(
        res => console.log('Correo enviado con éxito'),
        err => console.log('Error al enviar el correo', err)
      );
    }else{
      const apiUrl ='https://aia-1hto.onrender.com/send-email';
      this.http.post(apiUrl, datosPedido).subscribe(
        res => console.log('Correo enviado con éxito'),
        err => console.log('Error al enviar el correo', err)
      );
    }
  }
  
  async setOpen(isOpen: boolean, content?:any) {
    this.isModalOpen = await isOpen;
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
  pagar(code:any){
    this.info.preparePayment(this.totalPrice, this.finalPrice,code).subscribe(
      (respuesta) => {
        window.location.href = respuesta.payWithCard;
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
  async generarPedidoTarj(){
    const code = this.generateRandomId(12);
    const fecha = new Date().toLocaleDateString();
    for(const item of this.carritoItems){
      this.productoString += item.cuant + ' ' + item.name + ', ';
    }
    console.log("Code: "+code+'Productos: '+this.productoString);
    set(ref(this.database,'pedidos/'+ this.uid + code),{factura:{cliente: this.datos[6], id: this.datos[4], metodo: this.method, direccion: this.datos[7], celular:this.datos[5], mail:this.datos[1], tipoId:this.datos[3], compTransferencia:this.imageUrl},estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , fecha:fecha, retiro:this.retiro});
    await this.storage.create();
    await this.storage.set('code',code);
    await this.storage.set('uid',this.uid);
    await this.storage.set('pedido',this.productoString);
    await this.storage.set('retiro',this.retiro);

    this.imageUrl = "-";
    
    this.pagar(code);
  }
  async generarPedido(){
    const code = this.generateRandomId(12);
    const fecha = new Date().toLocaleDateString();
    for(const item of this.carritoItems){
      this.productoString += item.cuant + ' ' + item.name + ', ';
    }
    console.log("Code: "+code+'Productos: '+this.productoString);
    set(ref(this.database,'pedidos/'+ this.uid + code),{factura:{cliente: this.datos[6], id: this.datos[4], metodo: this.method, direccion: this.datos[7], celular:this.datos[5], mail:this.datos[1], tipoId:this.datos[3], compTransferencia:this.imageUrl},estado: 'Por reservar', reserva: this.productoString, precio: this.finalPrice , fecha:fecha, retiro:this.retiro});
  }
  async reservar() {
    
    const productosPedido: { nombre: string, cantidad: number }[] = [];
    set(ref(this.database, 'clients/' + this.uid), {});
    this.generarPedido();

    // Creamos un array de promesas para esperar todas las suscripciones
    const promesas = this.carritoItems.map(item => {
        return new Promise<void>((resolve) => {
            const route1 = ref(this.database, 'productos');
            const subscription = object(route1).subscribe(async attributes => {
                attributes.snapshot.forEach(element => {
                    const dato = element.val() as datauser;
                    const cantidad = dato.cantidad - item.cuant;

                    if (item.name === dato.producto) {
                        console.log("cantidad: " + cantidad);
                        update(ref(this.database, 'productos/' + item.name), { cantidad: cantidad });
                        productosPedido.push({ nombre: item.name, cantidad: item.cuant });
                    }
                });

                subscription.unsubscribe();
                resolve(); 
                this.carritoItems = [];
            });
        });
    });

    await Promise.all(promesas);
    this.menuAbierto = true;
    this.checkout = true;
    this.carritoItems = [];
    this.enviarPedido(productosPedido, this.datos[6], this.datos[4], this.datos[5], this.retiro, this.method, this.imageUrl);
    
  }

  
  async quitaritems(){
    const productosPedido: { nombre: string, cantidad: number }[] = [];
    set(ref(this.database,'clients/'+this.uid),{});
    for(const item of this.carritoItems){
    const route1 = ref(this.database, 'productos');
    const subscription = object(route1).subscribe(async attributes => {
    this.carritoItems= [];
    await attributes.snapshot.forEach(element => {
    const dato = element.val() as datauser;
    const cantidad = dato.cantidad - item.cuant;
    if(item.name == dato.producto){
      update(ref(this.database,'productos/'+item.name),{cantidad: cantidad})
      productosPedido.push({ nombre: item.name, cantidad: item.cuant });
      
      }
      
    });
    
    subscription.unsubscribe();
    

    });
    
    }
    this.carritoItems = [];
    await this.storage.create();
    await this.enviarPedido(await this.storage.get('pedido'), this.datos[6], this.datos[4], this.datos[5], await this.storage.get('retiro'), "Tarjeta Crédito/Débito", this.imageUrl);
  }
  async pay() { //abre el modal para el checkout
    
    this.setOpen(true);
    this.checkout=false;
  }

  
  async presentAlertBill(){ //abre el modal despues de payphone
    
    while(this.carritoItems.length==0){await this.info.mostrarCargando();await new Promise(resolve => setTimeout(resolve, 5000));}
    this.setOpen(true);
    this.quitaritems();
    this.carritoItems = [];
    this.checkout=true;
    this.menuAbierto = true;
  }
  presentingElement:any = null;
  async ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    const urlParams = new URLSearchParams(window.location.search);
    const successId = urlParams.get('id');
    const clientTransactionId = urlParams.get('clientTransactionId');
    
    console.log(successId);
    
    this.updateGlobalVariables();
    this.carga=true;
    await this.info.getUid().subscribe(async res => {
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
             this.carritoItems =[];
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
    await this.storage.create();
    if (successId!=null && clientTransactionId == await this.storage.get('code')) {
      console.log("vuelve");
      this.presentAlertBill();
    }
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
      const dato = carritoData[product] as datacar;
      
      if (dato && dato.cantidad > 0) {
        const newCantidad = dato.cantidad - 1;
        if (newCantidad > 0) {
          this.carritoItems = [];
          await update(ref(this.database, 'clients/' + this.uid + '/carrito/' + product), { cantidad: newCantidad });
          
        } else {
          this.carritoItems = [];
          await remove(ref(this.database, 'clients/' + this.uid + '/carrito/' + product));
          
        }
      }
    } else {
      console.log('No hay datos en el carrito');
      this.carritoItems = [];
    }
    this.carga=false;
  }
  
  async toGo(tabName:string){
    await this.setOpen(false);
    this.router.navigate([tabName]);
    this.navCtrl.navigateRoot(tabName);
    
  }
  abrirMenu() {
    this.info.toggleMenu();
  }

  esAndroid() {
    return this.platform.is('android');
  }
  selectFile() {
    this.fileInput.nativeElement.click();
  }
  async closeModal() {
    if (this.menuAbierto) {
      await this.setOpen(false); // Asegurarse de que el modal se cierre antes de continuar
      this.menuAbierto = false;
      
      setTimeout(() => {
        this.router.navigateByUrl('/inicio', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/inicio']);
        });
      }, 500);
    } else {
      await this.setOpen(false);
      this.menuAbierto = false;
    }
  }
  

  async uploadTrans(event: any) {
    const file = event.target.files[0];
    try {
      const downloadURL = await this.info.agregarStorage(file.name, file);
      this.imageUrl= await this.store.ref('transferencias/'+file.name).getDownloadURL().toPromise();
    } catch (error) {
      console.error('Error al subir el archivo', error);
    }
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