import * as dc from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { module, test } from 'qunit';

const URL_CODE = '2018-06-29' +
'[1]C20a3' +
'[2]D30b2' +
'[3]0f3';

const READABLE = () => [
`2018
June 29a,
July 1e,`,
`2018
June 30e,
July 2a,`,
`2018
July 6e,`
]

const SHORTHAND = () => ({startingDate: '2018-06-29', showData: [
  { "a": 1 },
  { "e": 2 },
  { "e": 1 },
  { "a": 2 },
  {},
  {},
  {},
  { "e": 3 }
]})

function numDaysWithShowings(showings: dc.IDayShowings[]): number {
  return showings.reduce((count, showing) => {
    if (showing.a || showing.e || showing.m) return count + 1;
    return count;
  }, 0)
}

module('Unit | Utility | showings-data-converters | simple functions', function() {

  test('getPaddingFor', function(assert) {
    let result = dc.getPaddingFor('2018-06-01');
    assert.equal(result, 5);
  });

  test('urlToShorthand', function(assert) {
    let result = dc.urlToShorthand(URL_CODE);

    assert.equal(numDaysWithShowings(result.showData), 5, 'has correct number of showings');
    assert.equal(result.startingDate, '2018-06-29', 'has the correct starting date')
    assert.deepEqual(result.showData, SHORTHAND().showData, 'show data looks correct');
  });

  test('shorthandToUrl', function(assert) {
    let result = dc.shorthandToUrl(SHORTHAND());
    assert.equal(result, URL_CODE)
  });
});

module('Unit | Utility | showings-data-converters | big converters', function() {

  test('fullCodeStringToReadable', function(assert) {
    let result = dc.fullCodeStringToReadable(URL_CODE);
    assert.deepEqual(result, READABLE())
  });

  test('readablesToUrl', function(assert) {
    let result = dc.readablesToUrl(READABLE());
    assert.equal(result, URL_CODE)
  });
});
