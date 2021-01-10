import { Router } from '@angular/router';
import { LoginService } from './../login.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private toastr:ToastrService,
    private router:Router,
    private login:LoginService) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', [this.confirmValidator]],
    });
  }

  ngOnInit() {}

  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

  createUser(){
    if(this.registerForm.invalid){
      this.toastr.warning('Fill all required fileds!','Validation',{timeOut:3000})
      return;
    }

    this.login.registerUser(this.registerForm.value).toPromise().then(res => {
      this.toastr.success('Registration successfully completed!, now you can login!','Success',{timeOut:3000});
      this.router.navigate(['auth','login']);
    }).catch(err => console.error(err))
    

  }
}
