import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { productEvent } from '../../../../models/enums/products/productEvent';
import { deleteProductAction } from '../../../../models/interface/products/event/deleteProductAction';
import { eventAction } from '../../../../models/interface/products/event/eventAction';
import { getAllProductsResponse } from '../../../../models/interface/products/response/getAllProductsResponse';
import { ProductsComponent } from '../../products.component';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    CommonModule,
    ProductsComponent,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
  ],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<getAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<eventAction>();
  @Output() deleteProductEvent = new EventEmitter<deleteProductAction>();

  public productSelected!: getAllProductsResponse;
  public addProductEvent = productEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = productEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData)
    }
  }

  handleDeleteProduct(product_id: string, productName: string): void {
    if (product_id !== '' && productName !== ''){
      this.deleteProductEvent.emit({
        product_id,
        productName,
      });
    }
  }
}
