import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { GeolocationService } from 'src/services/geolocation.service';
import * as L from 'leaflet';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('video') video: ElementRef;
  title = 'camaraapp';
  latitude: any;
  longitude: any;

  map: any;
  marker: L.Marker<any>;

  model: any;
  loading: boolean;
  predictions: any;

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

  async ngOnInit() {
    this.loading = true;
    this.model = await mobilenet.load();
    this.loading = false;
  }

  private initMap(): void {
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
    console.log(this.map);
  }

  ngAfterViewInit() {
    const vid = this.video.nativeElement;
    this.initMap();

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          vid.srcObject = stream;
          console.log(vid.srcObject);
        })
        .catch((err0r) => {
          console.log('Something went wrong!');
        });
    }

    setInterval(async () => {
      this.predictions = await this.model.classify(this.video.nativeElement);
   }, 3000);
  }

  public triggerCaptura(): void {
    // this.takeFoto();
    // this.getLocation()
    // this.trigger.next();
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

  // takeFoto() {
  //   console.log(this.video);
  //   const vid = this.video.nativeElement;

  //   if (navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then((stream) => {
  //         vid.srcObject = stream;
  //         console.log(vid.srcObject);
  //       })
  //       .catch((err0r) => {
  //         console.log('Something went wrong!');
  //       });
  //   }

  //   this.predictions = this.model.classify(this.video.nativeElement);
  // //   setInterval(() => {
  // //  }, 3000);
  // }

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

