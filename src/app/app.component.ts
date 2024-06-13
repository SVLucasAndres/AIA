import { Component } from '@angular/core';
import { InfoService } from './info.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private infoservice:InfoService
  ) {}
}
