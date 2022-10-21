import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, of, Subscription } from 'rxjs';
import { tap, takeWhile, delay } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, OnDestroy {
  command: string = 'bore -s bore.services -lp 8080';
  result: string = [
    'Generated HTTP URL:  http://532bbf43.bore.services',
    'Generated HTTPS URL: https://532bbf43.bore.services',
    'Direct TCP:          tcp://bore.services:60120'
  ].join('\n');
  displayCommand: string = '';
  displayResult: string = '';
  sub = new Subscription();

  ngOnInit(): void {
    let index = 0;
    interval(100)
      .pipe(
        tap(() => index++),
        takeWhile(() => index <= this.command.length)
      )
      .subscribe(
        () => {
          const cmd = this.command.slice(0);
          this.displayCommand = cmd.slice(0, index);
        },
        err => {
          console.error(err);
        },
        () => {
          of(this.result)
            .pipe(delay(500))
            .subscribe(result => (this.displayResult = result));
        }
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  type(): void {
    let index = 0;

    this.sub.add(
      interval(80)
        .pipe(
          tap(() => index++),
          takeWhile(() => index <= this.command.length)
        )
        .subscribe(
          () => {
            const cmd = this.command.slice(0);
            this.displayCommand = cmd.slice(0, index);
          },
          err => {
            console.error(err);
          },
          () => {
            this.sub.add(
              of(this.result)
                .pipe(delay(500))
                .subscribe(result => (this.displayResult = result))
            );
          }
        )
    );
  }
}
