import { userListRes } from './../entities/index';
import { UserService } from './../api/user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {


  fitlerForm: FormGroup;
  displayedColumns:string[] =['first_name','last_name','email'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  userData:userListRes;

  pageDetails = {
    currentPage:1,
    itemsPerPage:10,
    totalRecords:0
  }
  constructor(private fb:FormBuilder,
    private userapi:UserService) {
    this.fitlerForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['']
    });
   }
  

  ngOnInit(): void {
    this.filterList();
  }

  public filterList(){
    let filterVal = this.fitlerForm.value;
    this.userapi.getUserList(this.pageDetails.currentPage,this.pageDetails.itemsPerPage,filterVal.first_name,filterVal.last_name,filterVal.email).toPromise().then(res => {
      this.userData = res;
      this.loadGrid();
    })
    
  }

  public resetFilter(){
    this.fitlerForm.reset();
  }

  public pageEvent(event:PageEvent){
    this.pageDetails.itemsPerPage = event.pageSize;
    this.pageDetails.currentPage = event.pageIndex+1;
    this.filterList()
  }

  private loadGrid(){
    this.dataSource = new MatTableDataSource(this.userData.docs);
    this.dataSource.sort = this.sort;
    this.pageDetails.totalRecords = this.userData.total;
  }

}
