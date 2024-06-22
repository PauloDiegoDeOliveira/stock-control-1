import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { getAllProductsResponse } from '../../../models/interface/products/response/getAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  public productsDataEmitters$ = new BehaviorSubject<Array<getAllProductsResponse> | null>(null);
  public productsDatas: Array<getAllProductsResponse> = [];

  constructor() { }

  setProductsDatas(products: Array<getAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitters$.next(products);
      this.getProductsDatas()
    }
  }

  getProductsDatas() {
    this.productsDataEmitters$.pipe(take(1),
      map((data) => data?.filter((product) => product.amount > 0)))
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsDatas = response;
          }
        },
      });
    return this.productsDatas;
  }
}
