# ngx-electric-border

<a href="https://ngxui.com" target="_blank" style="display: flex;gap: .5rem;align-items: center;cursor: pointer; padding: 0; height: fit-content;">
  <img src="https://ngxui.com/assets/img/ngxui-logo.png" style="width: 64px;height: 64px;">
</a>

This Library is part of the NGXUI ecosystem.
View all available components at [https://ngxui.com](https://ngxui.com)

`@omnedia/ngx-electric-border` is an Angular component that renders an animated electric border using SVG turbulence,
multiple glow layers, and dynamic displacement. It automatically adapts to element size using ResizeObserver.

## Features

* Animated electric stroke using SVG filters
* Layered glows and displacement effects
* Fully reactive to component size changes
* Customizable color, thickness, speed, and chaos
* Standalone Angular component

## Installation

```bash
npm install @omnedia/ngx-electric-border
```

## Usage

```ts
import { NgxElectricBorderComponent } from '@omnedia/ngx-electric-border';

@Component({
  standalone: true,
  imports: [NgxElectricBorderComponent],
  template: `
    <om-electric-border [color]="'#5227FF'" [thickness]="2">
      <div class="box">Hello</div>
    </om-electric-border>
  `,
})
export class DemoComponent {
}
```

## API

```html

<om-electric-border
  [className]="string"
  [styling]="{ [key: string]: any }"

  [color]="'#rrggbb'"
  [speed]="number"
  [chaos]="number"
  [thickness]="number"
>
  ... content ...
</om-electric-border>
```

### Inputs

* **color**: Border color
* **speed**: Animation speed multiplier (default: `1`)
* **chaos**: Displacement intensity (default: `1`)
* **thickness**: Border thickness in px (default: `2`)
* **className** / **style**: Additional styling

## Example

```html

<om-electric-border
  style="width: 100%; height: 250px; display: block;"
  [color]="'#7aa5ff'"
  [speed]="1.2"
  [chaos]="1.4"
  [thickness]="3"
>
  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
    Electric Border
  </div>
</om-electric-border>
```

## Important Layout Note

If the projected content uses `width:100%` and `height:100%`, ensure the parent gives the component size.
Add this to your wrap container:

## Styling

```html

<div class="eb-wrapper">
  <om-electric-border [color]="'#d48bff'"></om-electric-border>
</div>
```

```css
.eb-wrapper {
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
}
```

## Contributing

PRs and issues are welcome.

## License

MIT
