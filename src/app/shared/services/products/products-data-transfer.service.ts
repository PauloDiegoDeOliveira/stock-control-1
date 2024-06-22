import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  /* Este serviço utilizando 'BehaviorSubject' foi construído para eliminar a necessidade de fazer uma segunda requisição paara o mesmo endpoint e também armazenar este valor para poder utilizar novamente em qualuqer outro componente que também necessite dele */

  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null); //Quando uma propriedade retornar um Observable, deve-se usar o $ por convenção
  public productsDatas: Array<GetAllProductsResponse> = [];



  constructor() { }

  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if(products) {
      this.productsDataEmitter$.next(products);
      this.getProductsData();
    }
  }

  getProductsData() {
    this.productsDataEmitter$.pipe(
      take(1),
      map((data) => data?.filter((product) => product.amount > 0))
    ).subscribe({
      next: (response) => {
        if (response) {
          this.productsDatas = response;
        }
      }
    });
    return this.productsDatas;
  }

}
