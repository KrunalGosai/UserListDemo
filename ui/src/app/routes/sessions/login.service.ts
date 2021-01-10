import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userRes } from './entities';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  private baseUrl = environment.SERVER_ORIGIN;

  public validateLogin(email:string,password:string):Observable<userRes>{
    let body = {email,password}
    return this.http.post<userRes>(this.baseUrl+'/users/login',body)
  }

  public registerUser(user:userRes):Observable<userRes>{
    let body = user;
    return this.http.post<userRes>(this.baseUrl+'/users',body)
  }


}
