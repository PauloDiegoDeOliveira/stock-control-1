import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from './../../services/products/products.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { eventAction } from '../../models/interface/products/event/eventAction';
import { getAllProductsResponse } from '../../models/interface/products/response/getAllProductsResponse';
import { ToolbarNavigationComponent } from '../../shared/components/toolbar-navigation/toolbar-navigation.component';
import { ProductsDataTransferService } from '../../shared/services/products/products-data-transfer.service';
import { ProductsFormComponent } from './dumb/products-form/products-form.component';
import { ProductsTableComponent } from './dumb/products-table/products-table.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,
    ToolbarNavigationComponent,
    ProductsTableComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  private ref!: DynamicDialogRef
  public productsDatas: Array<getAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.getServiceProductsDatas();
    console.log('Dados a serem passados para o modal:', this.productsDatas);

  }

  getServiceProductsDatas() {
    const prodcutsLoaded = this.productsDtService.getProductsDatas();

    if (prodcutsLoaded.length > 0) {
      this.productsDatas = prodcutsLoaded;
      console.log('DADOS DE PRODUTOS', this.productsDatas)
    } else this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            console.log('DADOS DE PRODUTOS', this.productsDatas)
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 3000,
          });
          this.router.navigate(['/dashboard']);
        }
      });
  }

  handleProductAction(event: eventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductsFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsDatas: this.productsDatas,
        }
      })
      this.ref.onClose.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsDatas()
        })
    }
  }

  handleDeleteProductAction(event: { product_id: string; productName: string; }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto: ${event?.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      })
    }
  }

  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService.deleteProduct(product_id).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              })
              this.getAPIProductsDatas()
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'erro',
              detail: 'Erro ao remover produto!',
              life: 2500,
            })
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete;
  }
}
