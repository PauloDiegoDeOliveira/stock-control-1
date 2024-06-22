import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  private errorMessages: { [key: string]: string } = {
    'Email already exists': 'O email já existe!',
    'Wrong username or password!': 'Usuário ou senha incorretos!',
    'Wrong password': 'Senha incorreta!'
    // outras traduções de erros
  };

  translateService(error: string): string {
    return this.errorMessages[error] || 'Erro desconhecido';
  }

  constructor() { }
}
