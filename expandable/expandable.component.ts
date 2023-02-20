import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

/**
 * Component for the collapsed content
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'collapsed',
  template: `<ng-content></ng-content>`,
})
export class CollapsedComponent { }

/**
 * Component for the expanded content
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'expanded',
  template: `<ng-content></ng-content>`,
})
export class ExpandedComponent { }

/**
 * Component for additional button
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'additional-button',
  template: `<ng-content></ng-content>`,
})
export class AdditionalButton { }

/**
 * Component for the optional trigger
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'trigger',
  template: `
    <ng-content *ngIf="!expanded" select="[expand]"></ng-content>
    <ng-content *ngIf="expanded" select="[collapse]"></ng-content>
  `,
})
export class TriggerComponent {
  /**
   * Tracks if component is expanded to show correct button content.
   */
  public expanded = false;

  /**
   * Input  material color for expand button
   */
  @Input()
  public expandColor = 'primary';

  /**
   * Input  material color for collapse button
   */
  @Input()
  public collapseColor = 'warn';

  /**
   * Input  of trigger component
   */
  @Input()
  public isHidden = false;
}

/**
 * Expandable component
 * Usage:
 * <expandable>
 *  <trigger> {{ TRIGGER CONTENT <Optional> }} </trigger>
 *  <collapsed> {{ COLLAPSED CONTENT }} </collapsed>
 *  <expanded> {{ EXPANDED CONTENT }} </expanded>
 * </expandable>
 */
@Component({
  selector: 'trunk-expandable',
  templateUrl: './expandable.component.html',
})
export class TrunkExpandableComponent implements AfterContentInit {
  /**
   * Variables for animating the expand
   */
  public expandAnimation = false;
  public expandedContent = false;
  public showExpanded = false;

  /**
   * Trigger settings variables
   */
  public hasTrigger = false;
  public triggerColor: string;
  public hideTrigger = false;
  @ContentChild(TriggerComponent)
  private trigger: TriggerComponent;
  @ContentChild(AdditionalButton)
  public additionalButton: AdditionalButton;

  /**
   * Instance id of expandable component
   */
  public instanceId: string = Math.random()
    .toString(16)
    .substring(2)
    .substring(Math.floor(Math.random() * 10));

  @ViewChild('expandedBody')
  public body: ElementRef;

  /**
   * Inputs
   */
  @Input() name: string;
  @Input('render-collapsed') renderContent: boolean | string = false;
  @Input('building-block') buildingBlock: boolean | string = false;
  @Input('no-container') noContainer: boolean | string = false;
  @Input('disabled') disabled: boolean | string = false;
  @Input('alert') alertType: string;
  alertClass: string;

  @Input() public onCollapse: Function = () => of(true);
  @Input() public onExpand: Function = () => of(true);

  /**
   * after content init
   */
  ngAfterContentInit() {
    if (this.alertType) {
      this.alertClass = `alert-${this.alertType}`;
    }

    if (this.trigger) {
      this.hasTrigger = true;
      this.triggerColor = this.trigger.expandColor;
      this.hideTrigger = this.trigger.isHidden;
    }

    this.renderContent = coerceBooleanProperty(this.renderContent);
    this.buildingBlock = coerceBooleanProperty(this.buildingBlock);
    this.noContainer = coerceBooleanProperty(this.noContainer);
    this.disabled = coerceBooleanProperty(this.disabled);

    if (this.renderContent) {
      setTimeout(() => {
        const el = this.body.nativeElement;
        el.style.height = '0px';
        el.style.overflow = 'hidden';
      }, 1);
    }
  }

  /**
   * Toggles expand
   * @returns
   */
  public toggleExpand() {
    if (this.disabled) {
      return;
    }
    const expand = !this.expandAnimation;

    if (!expand) {
      if (this.hasTrigger) {
        this.trigger.expanded = false;
        this.triggerColor = this.trigger.expandColor;
      }
      this.onCollapse(this)
        .pipe(first())
        .subscribe(res => {
          if (res) {
            this.doAnimation(expand);
          }
        });
    } else {
      if (this.hasTrigger) {
        this.trigger.expanded = true;
        this.triggerColor = this.trigger.collapseColor;
      }
      this.onExpand(this)
        .pipe(first())
        .subscribe(res => {
          if (res) {
            this.doAnimation(expand);
          }
        });
    }
  }

  private doAnimation(expand) {
    if (expand) {
      this.expandedContent = expand;
    }

    requestAnimationFrame(() => {
      this.expandAnimation = expand;
      if (this.body) {
        const el = this.body.nativeElement;

        el.style.overflow = 'hidden';
        if (expand) {
          el.style.height = '0px';
          this.showExpanded = true;
        }

        setTimeout(() => {
          const listener = () => {
            // if collapsing
            if (!expand) {
              this.showExpanded = false;
              this.expandedContent = false;
            } else {
              el.removeAttribute('style');
            }
            el.removeEventListener('transitionend', listener);
          };
          el.addEventListener('transitionend', listener);

          // account for no animation
          if (matchMedia('prefers-reduced-motion').matches) {
            setTimeout(() => {
              const expandBody = document.querySelectorAll(
                '.expandable.expanded .body'
              );
              expandBody.forEach(body => body.removeAttribute('style'));
            }, 1000);
          }

          setTimeout(() => {
            const expandTo = el.scrollHeight;
            const transition = el.style.transition;
            el.style.transition = '';

            if (expand) {
              requestAnimationFrame(() => {
                el.style.height = '0px';
                el.style.overflow = 'hidden';

                requestAnimationFrame(() => {
                  el.style.transition = transition;
                  el.style.height = `${expandTo}px`;
                });
              });
            } else {
              requestAnimationFrame(() => {
                el.style.height = `${expandTo}px`;

                requestAnimationFrame(() => {
                  el.style.transition = transition;
                  el.style.height = '0px';
                  el.style.overflow = 'hidden';
                });
              });
            }
          }, 15);
        });
      }
    });
  }
}
