import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.models';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private Url:string ='https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey:string = 'AIzaSyA4FY_jQYwc-3IIbaeb6QWejY0-E_rWFVc';

  userToken: string;
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    this.readToken();
   }

  logout(){
    localStorage.removeItem('token');

  }

  login( user: UserModel ){
    const authData  = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      `${ this.Url }signInWithPassword?key=${ this.apiKey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken']);
        return resp;
      })
    );
  }

  newUser( user: UserModel ){
    const authData  = {
      // email: user.email,
      // password: user.password,
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      `${ this.Url }signUp?key=${ this.apiKey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken']);
        return resp;
      })
    );
  }

  private saveToken( idToken: string ){
    this.userToken = idToken;
    localStorage.setItem( 'token', idToken );
    let today = new Date();
    today.setSeconds( 3600);
    localStorage.setItem('expira', today.getTime().toString() );
  }
  readToken(){
    if ( localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    if ( this.userToken.length > 2 ){
      return false;
    }
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if ( expiraDate > new Date()){
      return true
    } else {
      return false;
    }
  }
}
