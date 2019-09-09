import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { initialize, triggerKeyDown } from 'ember-keyboard';

module('Integration | Component | keyboard press', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    initialize();
  });

  test('it calls the action on the given key press', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{keyboard-press key="KeyJ" onDown=(action (mut pressed) true)}}`);

    triggerKeyDown('KeyJ');

    assert.equal(this.pressed, true);
  });
});
