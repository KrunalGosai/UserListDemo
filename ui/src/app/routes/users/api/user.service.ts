import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userListRes } from '../entities';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.SERVER_ORIGIN;

  constructor(private http:HttpClient) { }

  public getUserList(currentPage = 0,currentPageSize = 0,first_name = '',last_name = '', email = ''):Observable<userListRes>{

    let url = this.baseUrl+'/users?';
    if(currentPage > 0)
      url += `&currentPage=${currentPage}`;
    if(currentPageSize > 0)
      url += `&currentPageSize=${currentPageSize}`;
    if(first_name && first_name.trim()  != '')
      url += `&first_name=${first_name}`;
    if(last_name && last_name.trim()  != '')
      url += `&last_name=${last_name}`;
    if(email && email.trim()  != '')
      url += `&email=${email}`;

    url = url.replace('?&','?');

    return this.http.get<userListRes>(url)

  }
}
