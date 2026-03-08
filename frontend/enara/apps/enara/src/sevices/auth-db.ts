// src/app/services/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../constants/constants';

interface MyDB extends DBSchema {
  tokens: {
    key: string;
    value: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private db!: IDBPDatabase<MyDB>;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();
  private http = inject(HttpClient);
  private deleteLink = `${apiUrl}/user/delete`;
  private dbReady = false;
  constructor() {
    this.initDB();
  }

  private async initDB() {
    this.db = await openDB<MyDB>('MyAppDB', 1, {
      upgrade(db) {
        db.createObjectStore('tokens'); 
      },
    });
 this.dbReady = true;
    const token = await this.getToken();
    this.loggedInSubject.next(!!token);
  }


  async setToken(token: string) {
    await this.db.put('tokens', token, 'authToken');
    this.loggedInSubject.next(true);
  }


 async getToken(): Promise<string | null> {
  while (!this.dbReady) {
    await new Promise((r) => setTimeout(r, 50));
  }
  const token = await this.db.get('tokens', 'authToken');
  return token ?? null;
}


  async logout() {
    await this.db.delete('tokens', 'authToken');
    this.loggedInSubject.next(false);
  }
   onDelete() {
    const token = this.getToken();
    return this.http.delete(this.deleteLink, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

 
  isLoggedInSync(): boolean {
    return this.loggedInSubject.value;
  }
}
