import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { GeolocationService } from 'src/services/geolocation.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'camaraapp';
  latitude: any;
  longitude: any;

  map: any;
  marker: L.Marker<any>;

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
        this.map = L.map('map').setView([this.latitude, this.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
    });
  }
}

