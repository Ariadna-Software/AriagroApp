import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController  } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import * as numeral from 'numeral';




@IonicPage()
@Component({
  selector: 'page-modal-calidades-albaran',
  templateUrl: 'modal-calidades-albaran.html',
})
export class ModalCalidadesAlbaranPage {

  settings: any = {};
  campanya: any = {};
  user: any = {};
  entrada: any = {};
  calidades: any = [];
  incidencias: any = [];
  loading: any;
  correo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public localData: LocalDataProvider, public alertCrtl: AlertController, public loadingCtrl: LoadingController, 
     public ariagroData: AriagroDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.entrada = this.navParams.get('entrada');
        this.correo = this.settings.user.email;
        this.loadCalidades();

      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  loadCalidades(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando clasificacion...' });
    loading.present();
    this.ariagroData.getAlbaranClasificacion(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro)
    .subscribe(
      (data) => {
        loading.dismiss();
        this.calidades = this.prepareData(data[0]);
        this.incidencias = this.prepareIncidencias(data[1]);
      },
      (error) => {
        loading.dismiss();
        this.showAlert("ERROR", JSON.stringify(error, null, 4));
      }
    );
  }

  prepareData(calidades): any {
    var contador = 1;
    calidades.forEach(a => {
      if(a.kilos != null) {
        a.contador = contador++;
        a.kilos = numeral(a.kilos).format('0,0');
      }
    });
    return calidades;
  }

  prepareIncidencias(incidencias): any {
    var contador = 1;
    incidencias.forEach(a => {
        a.contador = contador++;
      });
    return incidencias;
  }

  

  comprobarCorreo(): void {
    var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
    if (emailRegex.test(this.correo)) {
      this.mostrarCorreo();
    } else {
      this.pedirCorreo();
    }
  }

  enviarCorreo(ruta): void {
    this.ariagroData.enviarCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.correo, ruta, this.campanya.nomempre)
      .subscribe(
        (data) => {
          this.loading.dismiss();
          this.showAlert("", JSON.stringify(data, null, 4));
          if( this.settings.user.email == ""){
            this.correo = null;
          }
          
        },
        (error) => {
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
          this.loading.dismiss();
        }
      );
  }

  pedirCorreo() {
    let alert = this.alertCrtl.create({
      title: 'Correo incorrecto, introduzca un correo',
      inputs: [
        {
          name: 'Correo',
          placeholder: 'ejemplo@servidor.com'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
            if (emailRegex.test(data.Correo)) {
              this.correo = data.Correo;
              this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
              this.loading.present();
              this.ariagroData.prepararCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro)
              .subscribe(
                (data) => {
                  this.enviarCorreo(data);
                },
                (error) => {
                  this.showAlert("ERROR", JSON.stringify(error, null, 4));
                }
              );
            }else {
              this.pedirCorreo()
            }
          }
        }
      ]
    });
    alert.present();
  }

  mostrarCorreo() {
    let alert = this.alertCrtl.create({
      title: 'Este es el correo al cual se va a enviar la clasificación. Puede introducir otro',
      inputs: [
        {
          name: 'Correo',
          value:  this.correo
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
            if (emailRegex.test(data.Correo)) {
              this.correo = data.Correo;
              this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
              this.loading.present();
              this.ariagroData.prepararCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro)
              .subscribe(
                (data) => {
                  this.enviarCorreo(data);
                },
                (error) => {
                  this.showAlert("ERROR", JSON.stringify(error, null, 4));
                }
              );
            }else {
              this.pedirCorreo()
            }
          }
        }
      ]
    });
    alert.present();
  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
