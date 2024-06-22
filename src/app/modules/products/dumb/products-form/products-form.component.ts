import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from './../../../../services/products/products.service';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

import { productEvent } from '../../../../models/enums/products/productEvent';
import { getCategoriesResponse } from '../../../../models/interface/categories/responses/getCategoriesResponse';
import { eventAction } from '../../../../models/interface/products/event/eventAction';
import { createProductRequest } from '../../../../models/interface/products/request/createProductRequest';
import { editProductResquest } from '../../../../models/interface/products/request/editProductRquest';
import { getAllProductsResponse } from '../../../../models/interface/products/response/getAllProductsResponse';
import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';
import { CategoriesService } from './../../../../services/categories/categories.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './products-form.component.html',
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: Array<getCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];

  public productAction!: {
    event: eventAction;
    productsDatas: Array<getAllProductsResponse>;
  };

  public productSelectedDatas!: getAllProductsResponse;
  public productsDatas: Array<getAllProductsResponse> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public addProductAction = productEvent.ADD_PRODUCT_EVENT;
  public editProductAction = productEvent.EDIT_PRODUCT_EVENT;
  public saletProductAction = productEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private productDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;
    console.log('Dados recebidos no modal:', this.productAction);

    console.log('Dados do produto:', this.productAction?.productsDatas); // Adicionado para depuração
    console.log('ID do produto:', this.productAction?.event?.id); // Adicionado para depuração

    if (
      this.productAction?.event?.action === this.editProductAction &&
      this.productAction?.productsDatas
    ) {
      this.getProductSelectedDatas(this.productAction?.event?.id as string);
    }
    this.productAction?.event?.action === this.saletProductAction &&
      this.getProductDatas();
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: createProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });
    }
    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction?.event?.id
    ) {
      const requestEditProduct: editProductResquest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
      };
      this.productService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produro editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao digitar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productsDatas;
    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );
      console.log('Produto filtrado:', productFiltered);

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];
        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
        });
      }
    }
  }

  getProductDatas(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
