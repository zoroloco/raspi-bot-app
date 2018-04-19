import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {catchError,retry} from "rxjs/operators";
import {Command} from './command';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

@Injectable()
export class RaspyService{
  private url = 'http://raspi-bot:7482/move';

  constructor(private http:HttpClient){}

  postCommand(cmd:Command): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<Command>(this.url,cmd,httpOptions).pipe(catchError(this.handleError));
  }

  handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error('an error occurred:',error.error.message);
    }
    else {
      console.error("backend returned code:"+JSON.stringify(error.status));
      console.error("error body:"+JSON.stringify(error.error));
    }
    return new ErrorObservable('something bad happened. please try later!');
  }

}
