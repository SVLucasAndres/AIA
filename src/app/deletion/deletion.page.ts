import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-deletion',
  templateUrl: './deletion.page.html',
  styleUrls: ['./deletion.page.scss'],
})
export class DeletionPage implements OnInit {

  constructor(private router:Router, private navCtrl:NavController) { }

  ngOnInit() {
  }
  toGo(tabName:string){
    this.router.navigate([tabName]);
    this.navCtrl.navigateRoot(tabName);
  }
}
