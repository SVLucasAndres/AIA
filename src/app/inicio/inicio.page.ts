import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Database, object ,ref} from '@angular/fire/database';
import Swiper from 'swiper';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {
  async manual() {
    await Browser.open({ url: this.enlacewa });
  };
  datos: any[] = [];
  productos : any[] = [];
  enlacewa:any;
  pedidos:any[] = [];
  carga: boolean = false;
  anuncios:any[]=[];
  private menuAbierto = false;
  uid:any;
  constructor(private database: Database, public info: InfoService, private platform: Platform, private router: Router, private menuCtrl: MenuController, private navCtrl: NavController) { }
  carritoNumber: number = 0;
  isModalOpen = false;
  presentingElement:any = null;
  mensaje(){
     
  }
  async setOpen(isOpen: boolean, content?:any) {
    this.isModalOpen = isOpen;
  }
  openLink = () => {
    window.open('https://wa.me/+593990586160?text=Buen%20día,%20deseo%20reportar%20un%20problema%20en%20la%20tienda%20virtual%20de%20AIA', '_blank');
  };
  report(){
    this.info.presentAlert("Reportar algun fallo", "Sabemos que para ti, como cliente, es tedioso lidiar con errores en este tipo de plataformas. Es por esto que pedimos de favor que nos ayudes con todos los detalles y/o capturas para resolverlo y mejorar. Gracias y pedimos las debidas disculpas", [
      {text: 'Cancelar', role: 'cancel'},
      {text: 'Reportar', handler: this.openLink}
    ]);
  }
  async ngOnInit() {
    this.carga=true;
    const route1 = await ref(this.database, 'productos');
    await object(route1).subscribe(attributes => {
      this.productos = [];
      attributes.snapshot.forEach(element => {
        const dato = element.val() as datauser;
        const gm = dato.GM;
        const cantidad = dato.cantidad;
        const desc = dato.descripcion;
        const image = dato.imagen;
        const precio = dato.precio;
        const product = dato.producto;
        if(cantidad<4){
          this.productos.push({ gm, cantidad, desc, image, precio, product });
        }
        
      });
      this.carga=false;
    });
    const route2 = await ref(this.database, 'anuncios');
    await object(route2).subscribe(attributes => {
      this.anuncios = [];
      attributes.snapshot.forEach(element => {
        const dato = element.val() as publicity;
        const title = dato.titulo;
        const subtitle = dato.subtitulo;
        const desc = dato.descripcion;
        const image = dato.imagen;
          this.anuncios.push({ title,subtitle,desc,image});
        
      });
    });
    this.info.getUid().subscribe(async res => {
      if (res != null) {
        this.datos = await this.info.obtenerBDD('UID', res?.uid);
        this.uid = await res?.uid;
        this.carga = true;
        console.log('clients/' + this.uid + '/carrito');
        object(ref(this.database,'pedidos')).subscribe(attributes =>{
          this.pedidos = [];
          attributes.snapshot.forEach(element=>{
            if(element.key.substring(0,28) == this.uid){
              const data = element.val() as pedido;
              const state = data.estado;
              if(state == 'Listo'){
                const price = data.precio;
                const prod = data.reserva.substring(0,data.reserva.length-2);
                const qr = element.key;
                const fecha = data.fecha
                this.enlacewa = 'https://wa.me/593990586160?text=Buenas%20tardes,%20estoy%20en%20camino%20a%20retirar%20mi%20pedido%20de%20'+ prod.replace(/ /g,'%20') + '%20que%20tiene%20como%20método%20de%20pago%20en%20'+ data.metodo+'.%20Muchas%20gracias';
                console.log(this.enlacewa);
                this.pedidos.push({state,price,prod,qr, fecha});
              }
            }else{
              console.log("no");
            }
          })
        })
        const route = await ref(this.database, 'clients/'+this.uid+'/carrito');
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
            this.carga=false;
          } else {
            console.log('No hay datos en el carrito');
            this.carga=false;
          }
        });
      } else {
        this.info.irA('/home');
        this.carga=false;
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
  async link(link:any){
    await Browser.open({url:link});
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
interface pedido {
  cedula:string,
  cliente:string,
  estado:string,
  precio:string,
  reserva:string,
  metodo:string,
  fecha:string,
}
interface publicity{
  titulo:string,
  subtitulo:string,
  descripcion: string,
  imagen:string, 
}