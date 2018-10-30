import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController  } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
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
  usaInformes: any;

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider, public navParams: NavParams, public viewCtrl: ViewController,
     public localData: LocalDataProvider, public alertCrtl: AlertController, public loadingCtrl: LoadingController, 
     public ariagroData: AriagroDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.usaInformes = this.settings.parametros.usaInformes;
        //renovar configuración de usuario
        this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
        .subscribe(
          (data) => {
            this.settings.user = data;
            this.user = this.settings.user;
            this.localData.saveSettings(this.settings);
            this.campanya = this.settings.campanya;
            this.entrada = this.navParams.get('entrada');
            this.correo = this.settings.user.email;
            this.renovarParametros();
            this.loadCalidades();
          },
          (error) => {
            if (error.status == 404) {
              this.showAlert("AVISO", "Usuario o contraseña incorrectos");
            } else {
              this.msg.showAlert(error);
            }
          }
        );
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
          },
          (error) => {
            if (error.status == 404) {
              let alert = this.alertCrtl.create({
                title: "AVISO",
                subTitle: "No se ha encontrado ninguna cooperativa con ese número",
                buttons: ['OK']
              });
              alert.present();
            } else {
              let alert = this.alertCrtl.create({
                title: "ERROR",
                subTitle: JSON.stringify(error, null, 4),
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
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
        this.msg.showAlert(error);
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

  comprobarPlantillas(){
    
    if(this.settings.parametros.infClasificacion == "" || this.settings.parametros.infClasificacion == null){
      this.showAlert('', 'Plantilla de factura no configurada');
    }else {
      this.comprobarCorreo();
    }
  }

  

  comprobarCorreo(): void {
    if(this.usaInformes == 0) {
      this.showAlert('', 'Funcionalidad no habilitada, póngase en contacto con su cooperativa');
    }else {
      var mens = "";
      var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
      if (emailRegex.test(this.correo)) {
        mens = 'Este es el correo al cual se va a enviar la clasificación. Puede introducir otro.';
      } else {
        mens = 'Correo incorrecto, introduzca un correo.';
      }
      this.mostrarCorreo(mens);
    }
  }

  enviarCorreo(ruta): void {
    this.ariagroData.enviarCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.correo, ruta, this.campanya.nomempre)
      .subscribe(
        (data) => {
          this.loading.dismiss();

          this.showAlert("", JSON.stringify('MENSAJE ENVIADO', null, 4));
          if( this.settings.user.email == ""){
            this.correo = null;
          }
          
        },
        (error) => {
          this.msg.showAlert(error);
          this.loading.dismiss();
        }
      );
  }

  
  mostrarCorreo(mens) {
    let alert = this.alertCrtl.create({
      title: mens,
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
              this.ariagroData.prepararCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro, this.settings.parametros.infClasificacion)
              .subscribe(
                (data) => {
                  this.enviarCorreo(data);
                },
                (error) => {
                  this.msg.showAlert(error);
                  this.loading.dismiss();
                }
              );
            }else {
              mens = 'Correo incorrecto, introduzca un correo';
              this.mostrarCorreo(mens);
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
