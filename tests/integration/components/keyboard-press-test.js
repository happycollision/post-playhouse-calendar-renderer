import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { initialize, triggerKeyDown, } from 'ember-keyboard';

moduleForComponent('keyboard-press', 'Integration | Component | keyboard press', {
  integration: true,

  beforeEach() {
    initialize();
  }
});

test('it calls the action on the given key press', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keyboard-press key="KeyJ" onDown=(action (mut pressed) true)}}`);

  triggerKeyDown('KeyJ')

  assert.equal(this.pressed, true);
});
