import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { TriggerComponent } from '.';
import { TrunkExpandableComponent } from './expandable.component';
import { TrunkExpandableModule } from './expandable.module';

@Component({
  template: `
    <trunk-expandable #expandable>
      <trigger>Expand!</trigger>
      <collapsed>Collapsed</collapsed>
      <expanded>Expanded</expanded>
    </trunk-expandable>
  `,
})
class TriggerTestWrapper {
  @ViewChild('expandable') expandable: TrunkExpandableComponent;
}

describe('TrunkExpandableComponent', () => {
  let wrapperComponent: TriggerTestWrapper;
  let wrapperFixture: ComponentFixture<TriggerTestWrapper>;
  let wrappedComponent: TrunkExpandableComponent;
  let component: TrunkExpandableComponent;
  let fixture: ComponentFixture<TrunkExpandableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TriggerTestWrapper],
      imports: [TrunkExpandableModule],
    }).compileComponents();
    wrapperFixture = TestBed.createComponent(TriggerTestWrapper);
    wrapperComponent = wrapperFixture.componentInstance;
    wrapperFixture.detectChanges();
    fixture = TestBed.createComponent(TrunkExpandableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a component', async () => {
    expect(wrapperComponent).toBeTruthy();
    wrappedComponent = wrapperComponent.expandable;
    expect(wrappedComponent).toBeDefined();
  });

  it('should display the trigger', async () => {
    wrappedComponent = wrapperComponent.expandable;
    wrappedComponent.expandAnimation = false;
    wrappedComponent.toggleExpand();
    wrappedComponent.expandAnimation = true;
    wrappedComponent.toggleExpand();
    expect(wrappedComponent.hasTrigger).toBe(true);
  });

  it('should not expand if onExpand returns false', fakeAsync(() => {
    component.onExpand = () => of(false);
    component.expandAnimation = false;
    component.toggleExpand();
    tick(1000);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.body).toBeUndefined();
    });
  }));

  it('should not collapse if onCollapse returns false', fakeAsync(() => {
    component.onCollapse = () => of(false);
    component.expandAnimation = false;
    component.toggleExpand();
    tick(1000);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.body).toBeDefined();

      component.toggleExpand();
      tick(1000);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.expandAnimation).toBe(true);
      });
    });
  }));

  it('should not display the trigger by default', async () => {
    expect(component.hasTrigger).toBe(false);
  });

  it('should run #toggleExpand()', fakeAsync(() => {
    component.expandAnimation = true;
    component.hasTrigger = true;
    component['trigger'] = {} as TriggerComponent;
    component['doAnimation'] = jest.fn();
    component.toggleExpand();
    expect(component['trigger'].expanded).toBeFalsy();
    expect(component['doAnimation']).toHaveBeenCalled();
  }));
});
