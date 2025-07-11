import { Component, OnInit, OnDestroy, inject } from '@angular/core'; // Import inject
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, FooterComponent, SidebarComponent } from './frame';
import { NgIf } from '@angular/common';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { CommonService } from './services/common.service';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import { JwtHelperService } from '@auth0/angular-jwt';
import { first } from 'rxjs/operators';
import { AuthenticationService } from './authentication/service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, NgIf, NgIdleKeepaliveModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [Idle, Keepalive, JwtHelperService], // Provide the services here
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inferrix-web-app-version19';
  headerFooter: any;
  timedOut = false;
  lastPing?: Date = undefined;
  subscription!: Subscription;
  onlineEvent!: Observable<Event>;
  offlineEvent!: Observable<Event>;
  subscriptions: Subscription[] = [];
// all private variable inject here.
  private router = inject(Router);
  private idle = inject(Idle);
  private keepalive = inject(Keepalive);
  private commonService = inject(CommonService);
  private jwtHelper = inject(JwtHelperService);
  private authenticationService = inject(AuthenticationService);

  constructor() {
    const source = interval(1795000);
    this.subscription = source.subscribe(val => this.refreshToken());

    // sets an idle timeout of 30 minutes
    this.idle.setIdle(1795);
    // sets a timeout period of 5 seconds. after 30 minute of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the page
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      this.timedOut = true;
      this.router.navigate(['/']);
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.commonService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        this.idle.watch();
        this.timedOut = false;
      } else {
        this.idle.stop();
      }
    });

const tokenCheckInterval = interval(60000); // Check every minute
    this.subscriptions.push(
      tokenCheckInterval.subscribe(() => this.checkTokenExpiration())
    );

  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  hideChildModal(): void {
  }

  stay() {
    this.reset();
  }

  logout() {
    this.commonService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.headerFooter = (event.url !== '/login' && event.url !== '/');
        }
      });
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.internetOnlineOffline();
  }

  // refreshToken() {
  //   this.authenticationService.refreshToken()
  //     .pipe(first())
  //     .subscribe(data => {
  //     });
  // }

  internetOnlineOffline() {
    this.subscriptions.push(
      this.onlineEvent.subscribe(e => {
        if (e.type === 'online') {
          this.commonService.notification('You are internet connected');
          this.router.navigate(['/login']).then(() => {
            this.router.navigate(['/login']);
          });
        }
      })
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe(e => {
        console.log('Offline event detected:', e);
        if (e.type === 'offline') {
          this.commonService.notification('You are not connected to internet');
          this.router.navigate(['internet-status']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

private checkTokenExpiration(): void {
    const token = this.authenticationService.getToken();
    if (token && this.jwtHelper.isTokenExpired(token)) {
      this.authenticationService.logout();
      this.commonService.setUserLoggedIn(false);
      this.router.navigate(['/login']);
    }
  }

  refreshToken() {
    this.authenticationService.refreshToken()
      .pipe(first())
      .subscribe({
        next: () => {
          // Token refreshed successfully
        },
        error: (err) => {
          this.authenticationService.logout();
          this.commonService.setUserLoggedIn(false);
          this.router.navigate(['/login']);
        }
      });
  }

  
}