import { Component, signal } from "@angular/core";

@Component({
    selector: 'app-counter',
    template: `
        <h1>Counter: {{ count() }}</h1>
        <button (click)="count.set(count() + 1)">Increment</button>
        <button (click)="count.set(count() - 1)">Decrement</button>
    `
})
export class CounterComponent {
    count = signal(0);

    increment() {
        this.count.set(this.count() + 1);
    }

    decrement() {
        this.count.set(this.count() - 1);
    }
}