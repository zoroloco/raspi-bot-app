import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {catchError,retry} from "rxjs/operators";
import {Command} from './command';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

@Injectable()
export class RaspyService{
  private host = 'http://192.168.1.237:7482';
  private movePath = '/move';
  private connectPath = '/connect';
  private disconnectPath = '/disconnect';

  constructor(private http:HttpClient){}

  connect(): Observable<any>{
    return this.http.get(this.host+this.connectPath).pipe(catchError(RaspyService.handleError));
  };

  disconnect(): Observable<any>{
    return this.http.get(this.host+this.disconnectPath).pipe(catchError(RaspyService.handleError));
  };

  postCommand(cmd:Command): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<Command>(this.host+this.movePath,cmd,httpOptions).pipe(catchError(RaspyService.handleError));
  }

  static handleError(error:HttpErrorResponse){
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
