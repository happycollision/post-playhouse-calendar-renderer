import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_DATES, DEFAULT_LONG_TITLES, DEFAULT_TITLES } from 'post-playhouse-calendar-renderer/tests/test-data';
import {
  fullCodeStringToPublishable,
  ShowingsData,
} from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

module('Integration | Component | showing-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('showingsData', new ShowingsData(DEFAULT_TITLES, DEFAULT_LONG_TITLES, DEFAULT_DATES));

    await render(hbs`{{showing-list showingsData=showingsData}}`);

    assert.ok(this.element);
  });

  test('it shows all the show titles', async function(assert) {
    this.set('showingsData', new ShowingsData(DEFAULT_TITLES, DEFAULT_LONG_TITLES, DEFAULT_DATES));

    await render(hbs`{{showing-list showingsData=showingsData}}`);

    assert.dom().containsText('Mermaid');
    assert.dom().containsText('Footloose');
    assert.dom().containsText('Chitty Chitty');
    assert.dom().containsText('Urinetown');
    assert.dom().containsText('42nd');
  });

  test('it shows all the show dates', async function(assert) {
    this.set('showingsData', new ShowingsData(DEFAULT_TITLES, DEFAULT_LONG_TITLES, DEFAULT_DATES));

    await render(hbs`{{showing-list showingsData=showingsData}}`);

    fullCodeStringToPublishable(DEFAULT_DATES).map(str => {
      str.split('\n').map(str => assert.dom().containsText(str.trim()));
    });
  });
});
