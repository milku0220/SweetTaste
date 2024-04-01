import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  readonly corsURL = 'https://cors-anywhere.herokuapp.com/';
  private baseUrl = 'http://presale.money-link.com.tw/sweetApi';
  public Name: string = "";
  public Phone: string = "";
  public Address: string = "";

  constructor(private http: HttpClient, private authService: AuthService) {}

  //購物車新增商品
  public addUserCart(userToken: string, productId: number, orderQuantity: number): Observable<any> {
    const body = {
      token: userToken,
      productId: productId,
      orderQuantity: orderQuantity
    };
    console.log(body);
    return this.http.post(`${this.corsURL}${this.baseUrl}/addUserCart`, body);
  }

  //取得User購物車內容
  public getUserCart(): Observable<CartItem[]> {
    const token = this.authService.getUserToken();
    const userToken = {token: token};
    // console.log(userToken);

    return this.http.post<any>(`${this.baseUrl}/getUserCart`, userToken).pipe(
      map(resp => {
        // 如果購物車為空
        if (!resp || !resp.data) {
          return;
        }
        return resp.data.map((productData: any) => {
          const product = new CartItem();
          product.productId = productData[resp.fieldIndex.productId];
          product.orderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
          product.curOrderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
          product.name = productData[resp.fieldIndex.name];
          product.price = productData[resp.fieldIndex.price];
          product.inventories = productData[resp.fieldIndex.inventories];
          product.img = productData[resp.fieldIndex.img];
          return product;
        });
      })
    );

    // return this.http.post<any>(`${this.baseUrl}/getUserCart`, userToken)
    //   .pipe(
    //     map(resp => resp.data.map((productData: any[]) => {
    //       const product = new CartItem();
    //       product.productId = productData[resp.fieldIndex.productId];
    //       product.orderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
    //       product.curOrderQuantity = Number(productData[resp.fieldIndex.orderQuantity]);
    //       product.name = productData[resp.fieldIndex.name];
    //       product.price = productData[resp.fieldIndex.price];
    //       product.inventories = productData[resp.fieldIndex.inventories];
    //       product.img = productData[resp.fieldIndex.img];
    //       return product;
    //     }))
    //   )
  }

  // 更新購物車商品數量
  public updateUserCart(userToken: string, productId: number, orderQuantity: number): Observable<any> {
    const body = {
      token: userToken,
      productId: productId,
      orderQuantity: orderQuantity
    };
    console.log(body);
    return this.http.post(`${this.corsURL}${this.baseUrl}/updateUserCart`, body);
  }

  // 刪除購物車商品
  public deleteUserCart(userToken: string, productId: number): Observable<any> {
    const body = {
      token: userToken,
      productId: productId
    }
    return this.http.post(`${this.corsURL}${this.baseUrl}/deleteUserCart`, body);
  }

  // 確認庫存是否足夠
  public batchUpdateUserCart(body: { token: string; userCarts: any[] }): Observable<any> {
    console.log(body);
    return this.http.post(`${this.corsURL}${this.baseUrl}/batchUpdateUserCart`, body);
  }

  // 儲存結帳User資料
  public setUserInfo(Name: string, Phone: string, Address: string) {
    this.Name = Name;
    this.Phone = Phone;
    this.Address = Address;
    // console.log(this.Name, this.Phone, this.Address);
  }

  // 結帳並清除購物車
  public checkoutUserCart(): Observable<any> {
    const userToken = localStorage.getItem('token');
    const body = {
      token: userToken,
      receiverName: this.Name,
      receiverPhone: this.Phone,
      receiverAddress: this.Address
    };
    console.log(body);
    return this.http.post(`${this.corsURL}${this.baseUrl}/checkoutUserCart`, body);
  }

  // 購物車icon顯示數量
  private cartItemCount = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCount.asObservable();

  // 取得購物車商品總數量
  public updateCartItemCount(): void {
    let totalItems = 0;
    this.getUserCart().subscribe(cartItems => {
      if(cartItems){
        totalItems = cartItems.reduce((sum, item) => sum + item.orderQuantity, 0);
      }
      // 更新BehaviorSubject的值
      this.cartItemCount.next(totalItems);
    });
  }
  
  // this.getUserCart().pipe(
    //   map(resp => {
    //     let totalItems: number = 0;

    //     if(resp.data){
    //       resp.data.forEach((item: any[]) => {
    //         const orderQuantity = Number(item[resp.fieldIndex.orderQuantity]);
    //         totalItems += orderQuantity;
    //       })
    //     };
    //     // 更新BehaviorSubject的值
    //     this.cartItemCount.next(totalItems);
    //     // console.log('=>',totalItems);
    //   })
    // ).subscribe(); 
  
}
