import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { errorMessage, successDialog, timeMessage } from 'src/app/shared/alerts/alerts';
import { UserLogin } from '../../Models/user.model';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
  }
  loginForm!:FormGroup;
  user!:UserLogin;

  constructor(public authService: AuthService,public router:Router,private fb:FormBuilder, private spinner: NgxSpinnerService) {
    this.createFrom();
  }

  login() {
    if(this.loginForm.invalid){
      return Object.values(this.loginForm.controls).forEach(control=>{
        control.markAsTouched();
      });
    }else{
      this.setUser();
      
      //SPINNER
      this.spinner.show()
      setTimeout(() => {
        this.spinner.hide()
      }, 1000);
      //PETICION
      this.authService.login(this.user).subscribe({
        next: (v) => { 
          timeMessage('Espere Un momento',1500)
          successDialog('Registro Completado')
          this.router.navigate(['/main/home'])
        },
        error: (e) => errorMessage('Email o Contraseña Incorrecta'),
        complete: () => console.info('complete') 
      })
    }
  }

  createFrom():void{
    this.loginForm = this.fb.group({
      email:['', [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password:['',[Validators.required,Validators.minLength(8)]]
    });
  }

  // get getEmail(){
  //   return this.loginForm.get('email') && this.loginForm.get('email')?.touched
  // }
  // get getPassword(){
  //   return this.loginForm.get('password') && this.loginForm.get('password')?.touched
  // }

  setUser():void{
    this.user = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }
  }
}