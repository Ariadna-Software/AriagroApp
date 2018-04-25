import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AriagroDataProvider {

  constructor(public http: HttpClient) {
  }

  getParametrosCentral(numCooperativa): any {
    let url = 'http://ariagro.myariadna.com:9901/api/parametros/' + numCooperativa;
    return this.http.get(url);
  }

  login(url, login, password): any {
    return this.http.get(url + '/api/usupush/login', {
      params: {
        login: login,
        password: password
      }
    });
  }

  getCampanyas(url): any {
    return this.http.get(url + '/api/campanyas');
  }

  getCampos(url, socio, campanya): any {
    return this.http.get(url + '/api/campos/socio', {
      params: {
        codsocio: socio,
        campanya: campanya
      }
    });
  }
}
