import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Database } from '@angular/fire/database';
import { Firestore } from '@angular/fire/firestore';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ref, remove } from 'firebase/database';

import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InfoService {
  async eliminarPedido(){
    await this.storage.create();
    const uid = await this.storage.get('uid');
    await this.storage.create();
    remove(ref(this.database,'pedidos/'+ uid + await this.storage.get('code')));
  }
  preparePayment( finalPrice: number,totalPrice: number,id:any): Observable<any> {
    const total = (totalPrice * 100);
    const subtotal = (finalPrice * 100);
    const parametros = {
      ResponseUrl: 'http://localhost:8100/carrito',
      CancellationUrl:'http://localhost:8100/deletion',
      Amount: total,
      AmountWithTax: parseInt((subtotal).toFixed(0)),
      Tax: parseInt((subtotal*0.15).toFixed(0)),
      ClientTransactionId: id,
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer LPQv8cljvo4geJIGAOVhK_26gX2xprKnVA2okHumqA_2WnU-PE1Kibm0oTBykuatHAi2hiJoKsllSeFsC9VVrPdFxiKYi-c2ROwirvU9r4_x-u17td665ObGiQ8ODwMDvl0fUitHtqTz8SB8-2LcDkO9KTj0siUo6uaE7I4lPnAOVy093ZSPI_qdmcNcoriPnB05e2nVwsE8BGawXGxbAn4s-GRLbqe7H_L-kk---BIAUoNDMhj-ZyRyDhiDARlN7b_og9nT9y_nRc1g2NY60giGAdPa0UMdZLM1CYEYXrDuRUEV4awVMjR3WR4aEuNlDkKM9tnh6ZTVQZfAto534lku9uk`
    });

    return this.http.post('https://pay.payphonetodoesposible.com/api/button/Prepare', parametros, { headers });
  }
  private menuAbierto = false;
  constructor(private database:Database,private storage:Storage,private menuCtrl:MenuController,private route:NavController,private alertController: AlertController,private toastController:ToastController, private db:Firestore, private auth:AngularFireAuth, private http: HttpClient, private store:AngularFireStorage, private loader:LoadingController) {
    
  }
  agregarStorage(path: string, data: any) {
    const fileRef = this.store.ref('transferencias/' + path);
    const task = this.store.upload('transferencias/' + path, data);
    return task.snapshotChanges().toPromise();
  }
  async presentToast(message:any,position: 'top' | 'middle' | 'bottom',color?:any,icon?:any, buttons?:any[]) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color:color,
      icon:icon,
      swipeGesture: 'vertical',
      buttons:buttons
    });
    await toast.present();
  }
  ruta:any
  async agregarBDD(link1:any,link2:any,parameters:{}){
    this.ruta = doc(this.db,link1,link2);
    await setDoc(this.ruta,parameters);
  }
  async actualizarBDD(link1:any,link2:any,parameters:{}){
    this.ruta = doc(this.db,link1,link2);
    await updateDoc(this.ruta,parameters);
  }
  async registrar(user: string, pass: string) {
   return await this.auth.createUserWithEmailAndPassword(user, pass);   
  }
  getUid(){
    return this.auth.authState;
  }
  async mostrarCargando(){
    const load =await  this.loader.create({
      duration:5000,
      spinner:'lines-sharp',
      message:'Espere, por favor',
    });
    load.present();
  }
  users:any[]=[];
  async login(user: string, pass: string):Promise<any>{
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(user, pass);
      const userVerified = userCredential.user?.emailVerified;
      console.log(userCredential.user?.uid);
      if (userVerified) {
          return 'Verificado';
      } else {
          throw new Error('NoVerificado');
      }
  } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
  }
  }
  async presentAlert(title:any,message:any,buttons:any[]) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: buttons,
      backdropDismiss: false
    });

    await alert.present();
  }
  async presentAlertRadio(title:any,message:any,buttons:any[],inputs:any[]) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: buttons,
      inputs:inputs,
      backdropDismiss: false
    });

    await alert.present();
  }
  async presentAlertInput(title:any,message:any,buttons:any[],inputs:any[]) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: buttons,
      inputs:inputs,
      backdropDismiss: false
    });

    await alert.present();
  }
  irA(ruta:any){
    this.route.navigateRoot(ruta);
  }
  async olvideContra(email:any){
   await this.auth.sendPasswordResetEmail(email);
  }
  async toggleMenu() {
    this.menuAbierto = await !this.menuAbierto;
    await this.menuCtrl.enable(this.menuAbierto, 'main-menu');
  }
  cerrarSesion(){
    try{
      this.auth.signOut();
      console.log("cerrado sesion correctamente");
    }catch(error){
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }
  async obtenerBDD(attribute:any,filter:any):Promise<any[]>{
    const users:any[]=[];
    this.ruta = collection(this.db,'Registros');
    const ref = query(this.ruta,where(attribute,'==', filter));
    const consulta = await getDocs(ref);
    consulta.forEach(element => {
      const dato = element.data() as Registro;
      const usuario = dato.user;
      const mail = dato.mail;
      const fechaNac = dato.fechaNacimiento;
      const tipo = dato.TipoID;
      const id = dato.Identificacion;
      const celular = dato.Celular;
      const nombre = dato.RazonSocial;
      const dir = dato.Direccion;
      users.push(usuario,mail,fechaNac,tipo,id,celular,nombre,dir);
    });
    return users;
  }
}
interface Registro{
  user:any,mail:any,fechaNacimiento:any,TipoID:any,Identificacion:any,Celular:any ,RazonSocial:any,Direccion:any
}
