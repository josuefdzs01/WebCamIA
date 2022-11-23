import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { GeolocationService } from 'src/services/geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'camaraapp';
  latitude: any;
  longitude: any;


  constructor(private locationService: GeolocationService){

  }

  // Hacer Toogle on/off
  public mostrarWebcam = true;
  // Errores al iniciar la cámara 
  public errors: WebcamInitError[] = [];
  // Ultima captura o foto 
  public imagenWebcam: WebcamImage = null;
  // Cada Trigger para una nueva captura o foto 
  public trigger: Subject<void> = new Subject<void>();

  ngOnInit(): void {
  }

  public triggerCaptura(): void {
    this.getLocation()
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.mostrarWebcam = !this.mostrarWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(imagenWebcam: WebcamImage): void {
    console.info('Imagen de la webcam recibida: ', imagenWebcam);
    this.imagenWebcam = imagenWebcam;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  getLocation() {
    this.locationService.getPosition().then(pos => {
        this.latitude = pos.lat;
        this.longitude = pos.lng;
    });
  }
}

