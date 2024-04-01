import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomDialogComponent } from '../models/custom-dialog/custom-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl = "http://presale.money-link.com.tw/sweetApi";    // sweetApi
  private userToken: string = 'token';    // localStorage記錄使用者登入的token名稱
  private userName: string = 'Username';    // localStorage記錄使用者登入帳號名稱

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  // 登入
  public onLogin(username: string, password: string, remember: boolean): void {
    this.http.post<any>(`${this.baseUrl}/login`, { username, password }).subscribe({
      next: (resp) => {
        this.setUserToken(resp.data);
        if (remember) {
          this.setUserName(username);
        } else {
          this.removeUserName();
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('Error', err);
        this.dialog.open(CustomDialogComponent, {
          width: '250px',
          data: { message: '帳號或密碼錯誤!' }
        });
      }
    })
  }

  // 登出
  public onLogout() {
    localStorage.removeItem(this.userToken);
    sessionStorage.clear();
  }

  // 將token存入localStorage
  public setUserToken(token: string): void {
    localStorage.setItem(this.userToken, token);
  }

  // 取得當前token
  public getUserToken(): string {
    return localStorage.getItem(this.userToken) || '';
  }

  // 將userName存入localStorage
  public setUserName(userName: string): void {
    localStorage.setItem(this.userName, userName);
  }

  // 取得當前userName
  public getUserName(): string {
    return localStorage.getItem(this.userName) || '';
  }

  // 移除localStorage裡面的userName
  public removeUserName(): void {
    localStorage.removeItem(this.userName);
  }

  // 是否有登入
  public isAuthenticated(): boolean {
    const token = this.getUserToken();
    return !!token; //如果token有值回傳true
  }

  // 註冊新帳號
  public register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { username, password })
  }

  // 確認帳號是否存在
  public checkUserExist(username: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/checkUserExist`, { username })
  }
}
