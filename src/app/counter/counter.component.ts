import { Component } from "@angular/core";

@Component({
    selector: 'app-counter',
    template: `
        <div class="counter">
            <h1>Counter: {{ count }}</h1>
            <button (click)="increment()">Increment</button>
            <button (click)="decrement()">Decrement</button>
        </div>
    `,
    styles: `
        .counter {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        button {
            margin: 0 0.5rem;
        }
    `
})
export class CounterComponent {
    count = 0;

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
}