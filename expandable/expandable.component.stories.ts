import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { of } from 'rxjs';
import { TrunkExpandableModule } from '.';
import { TrunkExpandableComponent } from './expandable.component';

export default {
  title: 'TrunkExpandableComponent',
  component: TrunkExpandableComponent,
  decorators: [
    moduleMetadata({
      imports: [TrunkExpandableModule],
    }),
  ],
} as Meta<TrunkExpandableComponent>;

const Template: Story<TrunkExpandableComponent> = (
  args: TrunkExpandableComponent
) => ({
  component: TrunkExpandableComponent,
  props: args,
  template: `<trunk-expandable>
  <collapsed>
    <div class="item-title-wrapper" data-first-letter="S">
      <div id="driverName">
        <p><strong>Seraphin Shinyu</strong></p>
        <p>Policyholder</p>
      </div>
    </div>
  </collapsed>
  <expanded>
    <dl class="data-table sub-table">
      <div class="data-row">
        <dt class="label" id="driverBirthday">Birthday:</dt>
        <dd class="value">Jan 01, 2000</dd>
      </div>
      <div class="data-row">
        <dt class="label" id="driverPrimaryVehicle">Primary Vehicle:</dt>
        <dd class="value">2012 ACURA MDX</dd>
      </div>
    </dl>
  </expanded>
</trunk-expandable>`,
});

export const Primary = Template.bind({});
Primary.args = {
  expandColor: 'primary',
  collapseColor: 'warn',
  isHidden: false,
  name: '',
  'render-collapsed': false,
  'building-block': false,
  'no-container': false,
  alert: '',
  onCollapse: () => of(true),
  onExpand: () => of(true),
};
