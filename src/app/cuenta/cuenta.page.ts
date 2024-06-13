import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  constructor(public info:InfoService) { }
  datos:any[]=[];
  carga:boolean=false;
  ngOnInit() {
    this.info.getUid().subscribe(async res => {
      if(res!=null){
        this.datos = await this.info.obtenerBDD('UID',res?.uid);
      }else{
        this.info.irA('/home');
      }
    });
  }
  async cerrarsesion(){
    this.carga = true;
    await this.info.cerrarSesion();
    this.carga = false;
  }
}
