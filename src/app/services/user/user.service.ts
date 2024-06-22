import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { authRequest } from '../../models/interface/user/auth/authRequest';
import { authResponse } from '../../models/interface/user/auth/authResponse';
import { signupUserRequest } from '../../models/interface/user/signupUserRequest';
import { signupUserResponse } from '../../models/interface/user/signupUserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = enviroment.API_URL;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) { }


  //Método que faz a requisição de login no backend e retorna os dados.
  signupUser(requestDatas: signupUserRequest): Observable<signupUserResponse> {
    return this.http.post<signupUserResponse>(`${this.API_URL}/user`, requestDatas)
  }

  //Método que faz a autenticação do login no backend e retorna os dados.
  authUser(requestDatas: authRequest): Observable<authResponse> {
    return this.http.post<authResponse>(`${this.API_URL}/auth`, requestDatas)
  }

  //Método que valida se o usuário possui um cookie com token.
  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
