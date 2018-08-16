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

  test('urlCodeParts', function(assert) {
    let result = dc.urlCodeParts(URL_CODE);
    assert.deepEqual(result, {startingDateString: '2018-06-29', showsDates: ['C20a3', 'D30b2', '0f3']})
  });

  test('dateCodeStringToTokens', function(assert) {
    let result = dc.dateCodeStringToTokens(dc.urlCodeParts(URL_CODE).showsDates.join(''));
    assert.deepEqual(result, ['C2', '0', 'a3', 'D3', '0', 'b2', '0', 'f3'])
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


module('Unit | Utility | showings-data-converters | real data ', function() {
  const REAL_URL = '2019-05-31[1]E30a3b2d3k3s3u3w20c3m3q3t1u2x2A2D30c1g2j1k2o3q2[2]0g3h3i2l3r3v3z30f2k3p3s3y3B20a3c3i3n2[3]n3o3p2t3y300b3j2l2n2t2w3A1E30c2f3h3j3p3r2[4]B3C3D200j3l3r3z30b3g3j2m3q3[5]00e3f3g2i3m2q2t3x3A3E20d2n3';

  const REAL_READABLE = () => [
  `2019
May 31e,
June 1e, 2a, 4e, 11e, 19e, 21e, 23a,
July 3e, 13e, 17e, 20m, 21a, 24a, 27a, 30e,
August 3m, 7a, 10m, 11a, 15e, 17a,`,
  `2019
June 7e, 8e, 9a, 12e, 18e, 22e, 26e,
July 6a, 11e, 16e, 19e, 25e, 28a,
August 1e, 3e, 9e, 14a,`,
  `2019
June 14e, 15e, 16a, 20e, 25e,
July 2e, 10a, 12a, 14a, 20a, 23e, 27m, 31e,
August 3a, 6e, 8e, 10e, 16e, 18a,`,
  `2019
June 28e, 29e, 30a,
July 10e, 12e, 18e, 26e,
August 2e, 7e, 10a, 13e, 17e,`,
  `2019
July 5e, 6e, 7a, 9e, 13a, 17a, 20e, 24e, 27e, 31a,
August 4a, 14e,`
  ]

  test('this data actually matches MY thinking', function(assert) {
    const tokens = dc.dateCodeStringToTokens(dc.urlCodeParts(REAL_URL).showsDates.join('')).filter(t => t !== '0');
    const showings = REAL_READABLE().join(' ').match(/\d{1,2}[aem]/g);
    const idTokens = tokens.map(t => dc.idTokenToShowingToken(t));

    assert.deepEqual(showings, idTokens);
  })
  
  test('fullCodeStringToReadable', function(assert) {
    let result = dc.fullCodeStringToReadable(REAL_URL);
    assert.deepEqual(result, REAL_READABLE())
  });

  test('readablesToUrl', function(assert) {
    let result = dc.readablesToUrl(REAL_READABLE());
    assert.equal(result, REAL_URL)
  });
});

