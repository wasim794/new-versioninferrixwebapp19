import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, FooterComponent, SidebarComponent } from './frame';
import { NgIf } from '@angular/common';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { CommonService } from './services/common.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication/service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NgIf,
    NgIdleKeepaliveModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [Idle, Keepalive, JwtHelperService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inferrix-web-app-version19';
  headerFooter: any;
  timedOut = false;
  lastPing?: Date = undefined;
  subscriptions: Subscription[] = [];

  // inject services
  private router = inject(Router);
  private idle = inject(Idle);
  private keepalive = inject(Keepalive);
  private commonService = inject(CommonService);
  private jwtHelper = inject(JwtHelperService);
  private authenticationService = inject(AuthenticationService);

  constructor() {
    // ✅ Idle configuration (30m inactivity logout)
    this.idle.setIdle(1795); // ~29.9 minutes
    this.idle.setTimeout(5); // 5s after idle reached
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.reset());
    this.idle.onTimeout.subscribe(() => this.logout());

    // ✅ Keepalive ping every 15s
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    // ✅ Start/stop idle watcher based on login status
    this.commonService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        this.idle.watch();
        this.timedOut = false;
      } else {
        this.idle.stop();
      }
    });
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  logout() {
    this.commonService.setUserLoggedIn(false);
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    // ✅ Dynamic header/footer visibility
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.headerFooter = event.url !== '/login' && event.url !== '/';
      }
    });

    // ✅ Track online/offline events
    const onlineEvent: Observable<Event> = fromEvent(window, 'online');
    const offlineEvent: Observable<Event> = fromEvent(window, 'offline');

    this.subscriptions.push(
      onlineEvent.subscribe((e) => {
        if (e.type === 'online') {
          this.commonService.notification('You are internet connected');
          // ✅ DO NOT force navigate to login here (was causing random logout)
        }
      })
    );

    this.subscriptions.push(
      offlineEvent.subscribe((e) => {
        if (e.type === 'offline') {
          this.commonService.notification('You are not connected to internet');
          this.router.navigate(['/internet-status']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.idle.stop();
  }
}
