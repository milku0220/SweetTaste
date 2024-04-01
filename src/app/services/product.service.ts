import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://presale.money-link.com.tw/sweetApi';
  
  constructor(private http: HttpClient) { }

  // 取得所有productType
  public getAllProductTypes(): Observable<any> {
    return this.http.post(`${this.baseUrl}/getAllProductType`, {});
  }

  // 根據typeId取得該種類所有product
  public getProductsByTypeId(typeId: number, chName?: string): Observable<Product[]> {
    return this.http.post<any>(`${this.baseUrl}/getProductsByTypeId`, { typeId })
      .pipe(
        map(resp => 
          resp.data.map((productData: any[]) => {
            const product = new Product();
            product.productId = productData[resp.fieldIndex.productId];
            product.name = productData[resp.fieldIndex.name];
            product.price = productData[resp.fieldIndex.price];
            product.inventories = productData[resp.fieldIndex.inventories];
            product.img = productData[resp.fieldIndex.img];
            product.orderQuantity = productData[resp.fieldIndex.types] ? productData[resp.fieldIndex.types] : 0;
            product.chName = chName ? chName: '小編推薦';    
            return product;
          })
        ),
        catchError(err => {
          console.log(err.error.message);
          return throwError(() => err);
        })
      );
  }

}

