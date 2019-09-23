import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { ShowingsData } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

module('Integration | Component | show-counts', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const showingsData = new ShowingsData(
      'First show,Second show,Third show',
      'First show,Second show,Third show',
      '[1]a2b3c3[2]b3d2[3]h1',
    );

    this.set('titles', ['First show', 'Second show', 'Third show']);

    this.set('showingsData', showingsData);

    await render(hbs`{{show-counts
      showingsData=showingsData
    }}`);

    assert.dom('[data-test-showing="0"]').containsText('First show');
    assert.dom('[data-test-showing-all="0"]').hasText('3');
    assert.dom('[data-test-showing-morning="0"]').hasText('0');
    assert.dom('[data-test-showing-afternoon="0"]').hasText('1');
    assert.dom('[data-test-showing-evening="0"]').hasText('2');

    assert.dom('[data-test-showing="1"]').containsText('Second show');
    assert.dom('[data-test-showing-all="1"]').hasText('2');
    assert.dom('[data-test-showing-morning="1"]').hasText('0');
    assert.dom('[data-test-showing-afternoon="1"]').hasText('1');
    assert.dom('[data-test-showing-evening="1"]').hasText('1');

    assert.dom('[data-test-showing="2"]').containsText('Third show');
    assert.dom('[data-test-showing-all="2"]').hasText('1');
    assert.dom('[data-test-showing-morning="2"]').hasText('1');
    assert.dom('[data-test-showing-afternoon="2"]').hasText('0');
    assert.dom('[data-test-showing-evening="2"]').hasText('0');
  });
});
