import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('p-calendar/week', 'Integration | Component | p calendar/week', {
  integration: true
});

skip('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{p-calendar/week}}`);

  assert.ok(true);
});
