import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | fallback', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it returns the first non-null/non-undefined value in a list', async function(assert) {
    this.setProperties({
      zero: 0,
      false: false,
      negative: -1,
      nulled: null,
      undef: undefined,
      emptyString: '',
      emptyObj: {},
      text: 'hello',
    });

    await render(hbs`{{fallback nulled text}}`);
    assert.equal(this.element.textContent.trim(), 'hello', 'passes over null to text');

    await render(hbs`{{fallback zero text}}`);
    assert.equal(this.element.textContent.trim(), '0', 'counts zero as a value');

    await render(hbs`{{fallback negative text}}`);
    assert.equal(this.element.textContent.trim(), '-1', 'counts -1 as a value');

    await render(hbs`{{fallback emptyString text}}`);
    assert.equal(this.element.textContent.trim(), '', 'returns an empty string... but that always checks out I think');

    await render(hbs`{{fallback false text}}`);
    assert.equal(this.element.textContent.trim(), 'false', 'counts false as a value');

    await render(hbs`{{fallback emptyObj text}}`);
    assert.equal(this.element.textContent.trim(), '[object Object]', 'passes along the empty object');

    await render(hbs`{{fallback nulled undef text}}`);
    assert.equal(this.element.textContent.trim(), 'hello', 'allows multiple passthroughs');
  });
});
