import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from '../model';
import {EnvService} from '../../core/services';
import {catchError} from "rxjs/operators";

@Injectable()
export class UsersService {
  private url = '/v2/users';

  constructor(private http: HttpClient, private env: EnvService) {
  }

  usersList(usersLimit: number, offset: number) {
    const url = `${this.env.apiUrl + this.url}?limit(${usersLimit},${offset})`;
    return this.http.get<any[]>(url);
  }

  allUsersList() {
    const url = `${this.env.apiUrl + this.url}`;
    return this.http.get<any[]>(url);

  }



  /* Add new user
 * @param user object
 * @return an `Observable` of the body as an `Object`.
 */
  addUser(user: Object) {
    return this.http.post(`${this.env.apiUrl + this.url}`, user)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /* get new user
* @param user object
* @return an `Observable` of the body as an `Object`.
*/
  getUser(username: string): Observable<User> {
    const url = `${this.env.apiUrl + this.url}/${username}`;
    return this.http.get <User>(url);
  }

  /* get new user
* @param user object
* @return an `Observable` of the body as an `Object`.
*/
  updateUser(username: string, userModel: User) {
    const url = `${this.env.apiUrl + this.url}/${username}`;
    return this.http.put(url, userModel);
  }

  /* get new user
* @param user object
* @return an `Observable` of the body as an `Object`.
*/
  deleteUser(username: string) {
    const url = `${this.env.apiUrl + this.url}/${username}`;
    return this.http.delete(url);
  }


}
