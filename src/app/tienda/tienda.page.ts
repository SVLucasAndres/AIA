import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Database, object, ref } from '@angular/fire/database';
import { get, set, update } from 'firebase/database';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class TiendaPage implements OnInit {
  datos: any[] = [];
  carga: boolean = false;
  private menuAbierto = false;
  productos: any[] = [];
  filteredProductos: any[] = [];
  uid: any;
  constructor(
    private database: Database,
    public info: InfoService,
    private navCtrl: NavController,
    private platform: Platform,
    private router: Router,
    private menuCtrl: MenuController,
    private modalController: ModalController
  ) {}
  carritoNumber: number = 0;
  
  async ngOnInit() {
    
    this.carga = true;
    this.info.getUid().subscribe(async res => {
      if (await res != null) {
        this.datos = await this.info.obtenerBDD('UID', res?.uid);
        this.uid = await res?.uid;
        console.log('clients/' + this.uid + '/carrito');
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
            
          } else {
            console.log('No hay datos en el carrito');
          }
        });
      } else {
        this.toGo('home');
      }
    });
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
        this.productos.push({ gm, cantidad, desc, image, precio, product });
      });
      this.filteredProductos = [...this.productos];
      this.carga=false;
    });
    this.presentingElement = document.querySelector('.ion-page');
    
  }
  badgeC:boolean = false;
  isModalOpen = false;
  modalP:any = {};
  async setOpen(isOpen: boolean, content?:any) {
    this.isModalOpen = isOpen;
    const route = await ref(this.database, 'productos');
    if(content!=null){
      await object(route).subscribe(attributes => {
        this.productos = [];
        attributes.snapshot.forEach(element => {
          const dato = element.val() as datauser;
          const product = dato.producto;
          if(content==product){
            const gm = dato.GM;
            const cantidad = dato.cantidad;
            const desc = dato.descripcion;
            const image = dato.imagen;
            const precio = dato.precio;
            if(cantidad<3){
              this.badgeC = false;
            }else{
              this.badgeC = true;
            }
            this.modalP = { gm, cantidad, desc, image, precio, product };
          }
        });
      });
    }
  }
  async cartAdd() {
    const carritoRef = ref(this.database, 'clients/' + this.uid + '/carrito');
    const producto = this.modalP;
    const carritoSnapshot = await get(carritoRef);
    const carrito = carritoSnapshot.val() || {};
    
    if (carrito[producto.product]) {
      if (carrito[producto.product].cantidad < producto.cantidad) {
        carrito[producto.product].cantidad += 1;
        this.info.presentToast(this.modalP.product + ' agregado al carrito', 'top', 'success', 'bag-check');
      } else {
        this.info.presentToast('La cantidad de este producto en el carrito excede el stock disponible', 'top', 'danger', 'warning');
      }
    } else {
      if (producto.cantidad > 0) {
        carrito[producto.product] = {
          nombre:producto.product,
          cantidad: 1
        };
        this.info.presentToast(this.modalP.product + ' agregado al carrito', 'top', 'success', 'bag-check');
      } else {
        this.info.presentToast('No hay suficiente stock disponible', 'top', 'danger', 'warning');
      }
    }
  
    await update(carritoRef, carrito);
  }
  
  
  presentingElement:any = null;
  async handleInput(event: any) {
    this.filteredProductos = [];
    this.carga=true;
    const query = await event.target.value.toLowerCase();
    console.log("Busca: "+query);
    this.filteredProductos = await this.productos.filter(productF => 
      productF.product.toLowerCase().includes(query)
    );
    if(this.filteredProductos.length == 0){
      this.info.presentToast('No se encontraron resultados','top','warning','sad');
    }
    this.carga=false;
  }

  toGo(tabName: string) {
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
