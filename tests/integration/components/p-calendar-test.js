import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { ShowingsData } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { DEFAULT_TITLES, DEFAULT_LONG_TITLES, DEFAULT_DATES } from 'post-playhouse-calendar-renderer/tests/test-data';

module('Integration | Component | p calendar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('showings', new ShowingsData(DEFAULT_TITLES, DEFAULT_LONG_TITLES, DEFAULT_DATES));

    await render(hbs`{{p-calendar showingsData=showings}}`);

    assert.ok(true);
  });
});
