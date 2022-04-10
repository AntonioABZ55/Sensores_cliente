import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage, successDialog, timeMessage } from 'src/app/shared/alerts/alerts';
import { User } from '../../Models/user.model';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public authService: AuthService, public router:Router,private fb:FormBuilder) {
    this.createFrom();
  }
  ngOnInit(): void {
  }
  loginForm!:FormGroup;
  user!:User;

  
  register() {
    if(this.loginForm.invalid){
      return Object.values(this.loginForm.controls).forEach(control=>{
        control.markAsTouched();
      });
    }else{
      this.setUser();
      this.authService.register(this.user).subscribe((data:any)=>{
        timeMessage('Espere Un momento',1500)
        successDialog('Registro Completado')
        this.router.navigate(['/auth/login'])
      },error=>{
        errorMessage('Datos Incorrectos')
      });
    }
  }

  createFrom():void{
    this.loginForm = this.fb.group({
      email:['', [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'), Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]],

    });
  }

  setUser():void{
    this.user = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
  }


}
