import { Component, signal } from "@angular/core";

@Component({
    selector: 'app-counter',
    template: `
        <div class="counter">
            <h1>Counter: {{ count() }}</h1>
            <button (click)="count.set(count() + 1)">Increment</button>
            <button (click)="count.set(count() - 1)">Decrement</button>
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
    count = signal(0);

    increment() {
        this.count.set(this.count() + 1);
    }

    decrement() {
        this.count.set(this.count() - 1);
    }
}