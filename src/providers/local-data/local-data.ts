import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalDataProvider {

  constructor(public storage: Storage) {
    
  }

  getSettings(): Promise<any> {
    return this.storage.get('ariagroApp');
  }

  saveSettings(settings): void {
    let data = JSON.stringify(settings);
    this.storage.set('ariagroApp', data);
  }

}
