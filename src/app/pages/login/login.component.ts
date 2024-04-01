import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from 'src/app/models/custom-dialog/custom-dialog.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public selectedPage: string = "login";
  public username: string = "";
  public password: string = "";
  public regName: string = "";
  public regPassword: string = "";
  public remember: boolean = false;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog, private cartService: CartService) {

    // 如果localStorage有帳號密碼資訊自動帶入
    const saveUsername = this.authService.getUserName();

    if(saveUsername){ 
      this.username = saveUsername;
      this.remember = true;
    }
  }


  //登錄
  public callLogin(): void {
    this.authService.onLogin(this.username, this.password, this.remember);
  }

  //註冊
  public onRegister() {
    // 進行註冊
    this.authService.register(this.regName, this.regPassword).subscribe({
      next: (resp)=>{
        console.log(resp.message);
        this.username = this.regName;
        this.selectedPage = "login";
        this.openDialog('註冊成功!');
      },
      error: (err)=>{
        if(err.error.status = '400') {
          this.openDialog('此帳號名稱已被註冊過');
        }
        console.log(err.error.message);
      }
    })
  }
    
  // Dialog
  public openDialog(msg: string): void {
    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: { message: msg }, 
    });
  }
}
