import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { ShowData } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

module('Integration | Component | p calendar/day', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    const setData = (shows = [], day = 'Sunday', date = 1, month = 'Jun') => {
      this.set('dayNameFull', day);
      this.set('monthName', month);
      this.set('mDay', date);
      this.set('shows', shows);
    }
    setData();

    await render(hbs`{{p-calendar/day dayNameFull=dayNameFull mDay=mDay monthName=monthName shows=shows}}`);

    assert.ok(true);
  });


  test('it highlights days with possible issues', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    const setData = (shows = [], day = 'Sunday', date = 1, month = 'Jun') => {
      this.set('dayNameFull', day);
      this.set('monthName', month);
      this.set('mDay', date);
      this.set('shows', shows);
    }
    setData();
    await render(hbs`{{p-calendar/day dayNameFull=dayNameFull mDay=mDay monthName=monthName shows=shows}}`);

    
    setData([
      new ShowData(1, '2p', {1: 'Some Show'}),
      new ShowData(2, '8p', {1: 'Some Other Show'}),
    ], 'Sunday')
    assert.dom('.day').hasClass('error', 'error when sunday has a second show');

    setData([new ShowData(1, '10a', {1: 'Some Show'})], 'Sunday')
    assert.dom('.day').hasClass('error', 'error when sunday showtime is not 2pm');

    setData([new ShowData(1, '2p', {1: 'Some Show'})], 'Sunday')
    assert.dom('.day').hasNoClass('error', 'no error when sunday showtime is 2pm');

    setData([new ShowData(1, '10a', {1: 'Some Show'})], 'Friday')
    assert.dom('.day').hasClass('error', 'error when 10am is not Saturday');

    setData([
      new ShowData(1, '2p', {1: 'Some Show'}),
      new ShowData(2, '2p', {1: 'Some Other Show'}),
    ])
    assert.dom('.day').hasClass('error', 'multiple showings at the same time');    
  });
});
