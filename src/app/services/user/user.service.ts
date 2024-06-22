import { AuthRequest } from './../../models/interfaces/user/auth/AuthRequest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/environments/environment'; //de desenvolvimento

@Injectable({
  providedIn: 'root', //Indica que este serviço pode ser usado em qualquer classe
})
export class UserService {
  private API_URL = environment.API_URL; //de desenvolvimento

  constructor(private http: HttpClient, private cookie: CookieService) {}

  //Criar um novo usuário ao clicar no botão 'criar conta':
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`, requestDatas);
  }

  //Autenticar um usuário criando um token JWT ao clicar no botão 'login':
  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }

  //Route guard (rotas protegidas)
  isloggedIn(): boolean {
    //Verificar se o user possui um token nos cookies do browser
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }

}
