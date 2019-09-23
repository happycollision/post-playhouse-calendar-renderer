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

  test('it shows groupings by price points', async function(assert) {
    // Here is what these dates would be in 2018
    // One
    //   June Wed 20, Fri 22, Sun 24*
    //   July Sat 28*, Tue 31
    // Two
    //   June Sun 10*, Wed 13, Tue 19
    //   July Sat 7*, Thu 12, Tue 17, Fri 20
    const dates = '2018-06-01' + '[1]t3v3x20B2E3' + '[2]j2m3s30g2l3q3t3';

    this.set('showingsData', new ShowingsData('One,Two', 'One,Two', dates));

    await render(hbs`{{showing-list showingsData=showingsData}}`);

    const expected = `One
  June Weekdays
    20
  June Weekends
    22, 24*

  July Weekdays
    31
  July Weekends
    28*


Two
  June Weekdays
    13, 19
  June Weekends
    10*

  July Weekdays
    12, 17
  July Weekends
    7*, 20`;
    assert.dom().containsText(expected);
  });
});
