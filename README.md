
# Expandable
Module to show a collapsed state by default and show details when the user clicks.

*This code is taken out of an Angular context with multiple brand configurations. The Sass is broken up the way it is to accommodate this architecture.*

![example](https://i.imgur.com/5cxGNmX.gif)

## Basic Usage

In your module:
```javascript
  import { ExpandableModule } from '@components';

  @NgModule({
    imports: [
      ExpandableModule
    ]
  })
```

In your component template:
```html
  <expandable>
    <collapsed>
      Content shown within the clickable area. Toggles whether the expanded section is shown or hidden.
    </collapsed>

    <expanded>
      Content shown/hidden when the collapsed content is clicked.
    </expanded>
  </expandable>
```

### Expandable options
#### Properties

| Attribute                            | Description |
| :----------------------------------- | :--- |
| `on-collapse: Function = () => of(true)`   | Pass a function as a reference to the expandable component to be called when the component is collapsed. Must return an observable. An observed value of `false` cancels the collapse.


## `on-collapse` usage:
```
  <expandable [on-collapse]="functionName">
    ...
  </expandable>
```
> Note: if you need access to your `this` scope in the passed function, be sure to bind it in your constructor.
> As such:
> ```
> constructor() { this.functionName = this.functionName.bind(this); }
> ```

## Using a trigger element
```html
  <expandable>
    <trigger>
      Toggle
    </trigger>

    <collapsed>
      Content shown within the clickable area. Toggles whether the expanded section is shown or hidden.
    </collapsed>

    <expanded>
      Content shown/hidden when the collapsed content is clicked.
    </expanded>
  </expandable>
```
### Trigger options
#### Properties

| Attribute                            | Description |
| :----------------------------------- | :--- |
| `color: string = 'primary'`            | The material color of the trigger button for both expanding and collapsing |
| `expand-color: string = this.color`    | The material color of the button when triggering the component to expand |
| `collapse-color: string = this.color`  | The material color of the button when triggering the component to collapse |

The `expand-color` and `collapse-color` attributes will take precedence over the `color` attribute.

Example:
```html
<trigger color="primary" expand-color="accent" collapse-color="primary-inverted">Toggle</trigger>
```

#### Children:
You can indicate different trigger content to show when expanded. Simply provide expand and collapse attributes on child elements.

Example:
```html
<trigger expand-color="accent" collapse-color="primary-inverted">
  <span expand>Open</span>
  <span collapse>Close</span>
</trigger>
```


***
