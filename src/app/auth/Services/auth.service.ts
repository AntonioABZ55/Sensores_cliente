import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User, UserLogin } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverURL=environment.apiURL  

  constructor(private http:HttpClient) { }

  login(user:UserLogin):Observable<any>{
    return this.http.post(`${this.serverURL}users/login`, user)
    .pipe(
      map((res:any)=>{
        this.saveToken(res.token.token)
        return res
      }),
      catchError((err)=>this.handlerError(err))
    );
  }

  private saveToken(token:string):void{
    localStorage.setItem("token",token)

  }

  private handlerError(err:any):Observable<never>{
    let errorMessage = `Ocurrio un Error`;
    if(err){
      errorMessage=`Error: code ${err.mesagge}`;
    }
    return throwError(errorMessage)
  }

  logout():void{
    const token:any = localStorage.getItem('token')
    const reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   });
    localStorage.removeItem('token')
    this.http.post(`${this.serverURL}logout`,token)
  }
  register(user: User): Observable<any> {
    return this.http.post(`${this.serverURL}users/register`, user)
  }
}
