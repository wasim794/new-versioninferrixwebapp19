import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../service';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DictionaryService } from "../../core/services/dictionary.service";
import { MatModuleModule } from '../../common/mat-module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'in-login',
  standalone: true,
  imports: [
    MatModuleModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  check: boolean = false;
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  hide = true;
  UIDICTIONARY: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      // console.log(this.UIDICTIONARY);
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    // Handle text click (Angular way)
    const textElements = this.el.nativeElement.querySelectorAll('.text');
    // textElements.forEach((el: HTMLElement) => {
    //   this.renderer.listen(el, 'click', () => {
    //     this.renderer.setStyle(document.body, 'background', 'lightgrey');
    //   });
    // });

    // Handle route-based styling (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      if (window.location.pathname === '/login') {
        this.renderer.setStyle(document.body, 'background', 'lightgrey');
      }
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls as {
      [key: string]: AbstractControl;
      username: AbstractControl;
      password: AbstractControl;
    };
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.check = true;
          this.commonService.setUserLoggedIn(true);
          localStorage.setItem('UserName', this.f['username'].value);
          this.commonService.notification(`The ${this.f['username'].value} has successfully logged in`);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.error = 'wrong credentials';
          this.loading = false;
        }
      });
  }
}