import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import { Capacitor } from '@capacitor/core';
import {OpenedBuyOrderService} from "./services/opened-buy-order.service";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "./shared/header/header.component";
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import {ProgressCircleComponent} from "./shared/progress-circle/progress-circle.component";
import {ProgressCircleService} from "./services/progress-circle.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule, NgIf, HeaderComponent, NgClass, ProgressCircleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  isNative = Capacitor.isNativePlatform();
  showAppSplash = true;

  showLoaderBar = true;

  constructor(private router: Router, private subjectService: OpenedBuyOrderService, private progressCircleService: ProgressCircleService) {

    this.progressCircleService.showLoader$.subscribe(show =>{
      this.showLoaderBar = show;
    })

    if(this.isNative){
      StatusBar.setStyle({ style: Style.Light }); // ou .Dark
      StatusBar.setOverlaysWebView({ overlay: false });

      SplashScreen.hide();
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.showAppSplash = false;
    }, 4000);
    this.router.navigate(['']).then(r => this.subjectService.subjectIsNative.next(this.isNative));
  }
}
