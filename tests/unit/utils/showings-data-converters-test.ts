import * as dc from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { module, test } from 'qunit';
import { DEFAULT_DATES, DEFAULT_LONG_TITLES } from 'post-playhouse-calendar-renderer/tests/test-data';
import { DateTime } from 'luxon';

const LONG_TITLES = 'Show One,Show Two,Show Three';
const SHORT_TITLES = 'S1,S2,S3';

const URL_DATES_CODE = '2018-06-29' + '[1]C2D30a3' + '[2]D30b4' + '[3]0f3';

const READABLE_DATES = () => [
  `2018
June 29a, 30e,
July 1e,`,
  `2018
June 30e,
July 2ma,`,
  `2018
July 6e,`,
];

const PUBLISHABLE_DATES = () => [
  `June 29*, 30
July 1`,
  `June 30
July 2‡, 2*`,
  `July 6`,
];

const SHORTHAND = () => ({
  startingDate: '2018-06-29',
  showData: [{ a: [1] }, { e: [1, 2] }, { e: [1] }, { m: [2], a: [2] }, {}, {}, {}, { e: [3] }],
});

function numDaysWithShowings(showings: dc.IDayShowings[]): number {
  return showings.reduce((count, showing) => {
    if (showing.a || showing.e || showing.m) return count + 1;
    return count;
  }, 0);
}

module('Unit | Utility | showings-data-converters | simple functions', function() {
  test('getPaddingFor', function(assert) {
    let result = dc.getPaddingFor('2018-06-01');
    assert.equal(result, 5);
  });

  test('urlToShorthandPerShow', function(assert) {
    let result = dc.urlToShorthandPerShow(URL_DATES_CODE);
    let expected = [
      [{ a: [1] }, { e: [1] }, { e: [1] }],
      [{}, { e: [2] }, {}, { m: [2], a: [2] }],
      [{}, {}, {}, {}, {}, {}, {}, { e: [3] }],
    ];

    assert.deepEqual(result, expected, 'show data looks correct');
  });

  test('urlToShorthand', function(assert) {
    let result = dc.urlToShorthand(URL_DATES_CODE);

    assert.equal(numDaysWithShowings(result.showData), 5, 'has correct number of showings');
    assert.equal(result.startingDate, '2018-06-29', 'has the correct starting date');
    assert.deepEqual(result.showData, SHORTHAND().showData, 'show data looks correct');
  });

  test('shorthandToUrl', function(assert) {
    let result = dc.shorthandToUrl(SHORTHAND());
    assert.equal(result, URL_DATES_CODE);
  });

  test('urlCodeParts', function(assert) {
    let result = dc.urlCodeParts(URL_DATES_CODE);
    assert.deepEqual(result, { startingDateString: '2018-06-29', showsDates: ['C2D30a3', 'D30b4', '0f3'] });
  });

  test('dateCodeStringToTokens', function(assert) {
    let result = dc.dateCodeStringToTokens(dc.urlCodeParts(URL_DATES_CODE).showsDates.join(''));
    assert.deepEqual(result, ['C2', 'D3', '0', 'a3', 'D3', '0', 'b4', '0', 'f3']);
  });
});

module('Unit | Utility | showings-data-converters | big converters', function() {
  test('fullCodeStringToReadable', function(assert) {
    let result = dc.fullCodeStringToReadable(URL_DATES_CODE);
    assert.deepEqual(result, READABLE_DATES());
  });

  test('fullCodeStringToPublishable', function(assert) {
    let result = dc.fullCodeStringToPublishable(URL_DATES_CODE);
    assert.deepEqual(result, PUBLISHABLE_DATES());
  });

  test('readablesToUrl', function(assert) {
    let result = dc.readablesToUrl(READABLE_DATES());
    assert.equal(result, URL_DATES_CODE);
  });

  test('urlDataToShowingsLists', function(assert) {
    let result = dc.urlDataToShowingsLists(LONG_TITLES, URL_DATES_CODE);
    let expected = [
      {
        title: 'Show One',
        dates: 'June 29*, 30\nJuly 1',
      },
      {
        title: 'Show Two',
        dates: 'June 30\nJuly 2‡, 2*',
      },
      {
        title: 'Show Three',
        dates: 'July 6',
      },
    ];
    assert.deepEqual(result, expected);
  });

  test('urlDataToShowingsAgenda', function(assert) {
    let result = dc.urlDataToShowingsAgenda(LONG_TITLES, URL_DATES_CODE);
    let expected = [
      {
        dateString: 'June 29',
        performances: [{ timeString: '2pm', title: 'Show One' }],
      },
      {
        dateString: 'June 30',
        performances: [{ timeString: '8pm', title: 'Show One' }, { timeString: '8pm', title: 'Show Two' }],
      },
      {
        dateString: 'July 1',
        performances: [{ timeString: '8pm', title: 'Show One' }],
      },
      {
        dateString: 'July 2',
        performances: [{ timeString: '10am', title: 'Show Two' }, { timeString: '2pm', title: 'Show Two' }],
      },
      {
        dateString: 'July 6',
        performances: [{ timeString: '8pm', title: 'Show Three' }],
      },
    ];
    assert.deepEqual(result, expected);
  });

  test('urlDataToShowingsAgenda', function(assert) {
    let result = dc.urlPartsToData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
    const createTimestamp = (str: string) => DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toMillis();
    const createDateString = (str: string) => DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toFormat('LLLL d');
    let expected = [
      {
        timestamp: createTimestamp('June 29'),
        dateString: createDateString('June 29'),
        performances: [{ timeString: '2pm', fullTitle: 'Show One', shortTitle: 'S1' }],
      },
      {
        timestamp: createTimestamp('June 30'),
        dateString: createDateString('June 30'),
        performances: [
          { timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' },
          { timeString: '8pm', fullTitle: 'Show Two', shortTitle: 'S2' },
        ],
      },
      {
        timestamp: createTimestamp('July 1'),
        dateString: createDateString('July 1'),
        performances: [{ timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }],
      },
      {
        timestamp: createTimestamp('July 2'),
        dateString: createDateString('July 2'),
        performances: [
          { timeString: '10am', fullTitle: 'Show Two', shortTitle: 'S2' },
          { timeString: '2pm', fullTitle: 'Show Two', shortTitle: 'S2' },
        ],
      },
      {
        timestamp: createTimestamp('July 6'),
        dateString: createDateString('July 6'),
        performances: [{ timeString: '8pm', fullTitle: 'Show Three', shortTitle: 'S3' }],
      },
    ];
    assert.deepEqual(result, expected);
  });
});

module('Unit | Utility | showings-data-converters | real data ', function() {
  const REAL_URL_DATES_CODE =
    '2019-05-31[1]E30a3b2d3k3s3u3w20c3m3q3t1u2x2A2D30c1g2j1k2o3q2[2]E30g3h3i2l3r3v3z30f2k3p3s3y3B20a3c3i3n2[3]0n3o3p2t3y30b3j2l2n2t2w3A1E30c2f3h3j3p3r2[4]0B3C3D20j3l3r3z30b3g3j2m3q3[5]00e3f3g2i3m2q2t3x3A3E20d2n3';

  const REAL_READABLE_DATES = () => [
    `2019
May 31e,
June 1e, 2a, 4e, 11e, 19e, 21e, 23a,
July 3e, 13e, 17e, 20m, 21a, 24a, 27a, 30e,
August 3m, 7a, 10m, 11a, 15e, 17a,`,
    `2019
May 31e,
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
August 4a, 14e,`,
  ];

  const REAL_PUBLISHABLE_DATES = () => [
    `May 31
June 1, 2*, 4, 11, 19, 21, 23*
July 3, 13, 17, 20‡, 21*, 24*, 27*, 30
August 3‡, 7*, 10‡, 11*, 15, 17*`,
    `May 31
June 7, 8, 9*, 12, 18, 22, 26
July 6*, 11, 16, 19, 25, 28*
August 1, 3, 9, 14*`,
    `June 14, 15, 16*, 20, 25
July 2, 10*, 12*, 14*, 20*, 23, 27‡, 31
August 3*, 6, 8, 10, 16, 18*`,
    `June 28, 29, 30*
July 10, 12, 18, 26
August 2, 7, 10*, 13, 17`,
    `July 5, 6, 7*, 9, 13*, 17*, 20, 24, 27, 31*
August 4*, 14`,
  ];

  const REAL_SHOWINGS_AGENDA_FROM_DEFAULTS = [
    {
      dateString: 'June 1',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 2',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 3',
      performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 5',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 8',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 9',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 10',
      performances: [{ timeString: '2pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 12',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 13',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 15',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'June 16',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'June 17',
      performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'June 19',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 20',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 21',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'June 22',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 23',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 24',
      performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'June 26',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'June 27',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'June 29',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },
    {
      dateString: 'June 30',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },

    {
      dateString: 'July 1',
      performances: [{ timeString: '2pm', title: 'Urinetown' }],
    },
    {
      dateString: 'July 3',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'July 4',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'July 6',
      performances: [{ timeString: '8pm', title: '42nd Street' }],
    },
    {
      dateString: 'July 7',
      performances: [{ timeString: '2pm', title: 'Footloose' }, { timeString: '8pm', title: '42nd Street' }],
    },
    {
      dateString: 'July 8',
      performances: [{ timeString: '2pm', title: '42nd Street' }],
    },
    {
      dateString: 'July 10',
      performances: [{ timeString: '8pm', title: '42nd Street' }],
    },
    {
      dateString: 'July 11',
      performances: [
        { timeString: '2pm', title: 'Chitty Chitty Bang Bang' },
        { timeString: '8pm', title: 'Urinetown' },
      ],
    },
    {
      dateString: 'July 12',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'July 13',
      performances: [
        { timeString: '2pm', title: 'Chitty Chitty Bang Bang' },
        { timeString: '8pm', title: 'Urinetown' },
      ],
    },
    {
      dateString: 'July 14',
      performances: [
        { timeString: '2pm', title: '42nd Street' },
        { timeString: '8pm', title: "Disney's The Little Mermaid" },
      ],
    },
    {
      dateString: 'July 15',
      performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'July 17',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'July 18',
      performances: [
        { timeString: '2pm', title: '42nd Street' },
        { timeString: '8pm', title: "Disney's The Little Mermaid" },
      ],
    },
    {
      dateString: 'July 19',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },
    {
      dateString: 'July 20',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'July 21',
      performances: [
        { timeString: '10am', title: "Disney's The Little Mermaid" },
        { timeString: '2pm', title: 'Chitty Chitty Bang Bang' },
        { timeString: '8pm', title: '42nd Street' },
      ],
    },
    {
      dateString: 'July 22',
      performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'July 24',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'July 25',
      performances: [
        { timeString: '2pm', title: "Disney's The Little Mermaid" },
        { timeString: '8pm', title: '42nd Street' },
      ],
    },
    {
      dateString: 'July 26',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'July 27',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },
    {
      dateString: 'July 28',
      performances: [
        { timeString: '10am', title: 'Chitty Chitty Bang Bang' },
        { timeString: '2pm', title: "Disney's The Little Mermaid" },
        { timeString: '8pm', title: '42nd Street' },
      ],
    },
    {
      dateString: 'July 29',
      performances: [{ timeString: '2pm', title: 'Footloose' }],
    },
    {
      dateString: 'July 31',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },

    {
      dateString: 'August 1',
      performances: [
        { timeString: '2pm', title: '42nd Street' },
        { timeString: '8pm', title: 'Chitty Chitty Bang Bang' },
      ],
    },
    {
      dateString: 'August 2',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'August 3',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },
    {
      dateString: 'August 4',
      performances: [
        { timeString: '10am', title: "Disney's The Little Mermaid" },
        { timeString: '2pm', title: 'Chitty Chitty Bang Bang' },
        { timeString: '8pm', title: 'Footloose' },
      ],
    },
    {
      dateString: 'August 5',
      performances: [{ timeString: '2pm', title: '42nd Street' }],
    },
    {
      dateString: 'August 7',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'August 8',
      performances: [
        { timeString: '2pm', title: "Disney's The Little Mermaid" },
        { timeString: '8pm', title: 'Urinetown' },
      ],
    },
    {
      dateString: 'August 9',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'August 10',
      performances: [{ timeString: '8pm', title: 'Footloose' }],
    },
    {
      dateString: 'August 11',
      performances: [
        { timeString: '10am', title: "Disney's The Little Mermaid" },
        { timeString: '2pm', title: 'Urinetown' },
        { timeString: '8pm', title: 'Chitty Chitty Bang Bang' },
      ],
    },
    {
      dateString: 'August 12',
      performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'August 14',
      performances: [{ timeString: '8pm', title: 'Urinetown' }],
    },
    {
      dateString: 'August 15',
      performances: [{ timeString: '2pm', title: 'Footloose' }, { timeString: '8pm', title: '42nd Street' }],
    },
    {
      dateString: 'August 16',
      performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }],
    },
    {
      dateString: 'August 17',
      performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }],
    },
    {
      dateString: 'August 18',
      performances: [
        { timeString: '2pm', title: "Disney's The Little Mermaid" },
        { timeString: '8pm', title: 'Urinetown' },
      ],
    },
    {
      dateString: 'August 19',
      performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }],
    },
  ];

  test('this data actually matches MY thinking', function(assert) {
    const tokens = dc
      .dateCodeStringToTokens(dc.urlCodeParts(REAL_URL_DATES_CODE).showsDates.join(''))
      .filter(t => t !== '0');
    const showings = REAL_READABLE_DATES()
      .join(' ')
      .match(/\d{1,2}[aem]/g);
    const idTokens = tokens.map(t => dc.idTokenToShowingToken(t));

    assert.deepEqual(showings, idTokens);
  });

  test('fullCodeStringToReadable', function(assert) {
    let result = dc.fullCodeStringToReadable(REAL_URL_DATES_CODE);
    assert.deepEqual(result, REAL_READABLE_DATES());
  });

  test('fullCodeStringToPublishable', function(assert) {
    let result = dc.fullCodeStringToPublishable(REAL_URL_DATES_CODE);
    assert.deepEqual(result, REAL_PUBLISHABLE_DATES());
  });

  test('readablesToUrl', function(assert) {
    let result = dc.readablesToUrl(REAL_READABLE_DATES());
    assert.deepEqual(result, REAL_URL_DATES_CODE);
  });

  test('urlDataToShowingsAgenda', function(assert) {
    let result = dc.urlDataToShowingsAgenda(DEFAULT_LONG_TITLES, DEFAULT_DATES);
    assert.deepEqual(result, REAL_SHOWINGS_AGENDA_FROM_DEFAULTS);
  });
});

module('Unit | Utility | ShowingsData class', function() {
  const createTimestamp = (str: string) => DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toMillis();
  const createDateString = (str: string) => DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toFormat('LLLL d');

  test('it initializes', function(assert) {
    assert.ok(new dc.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE));
  });

  test('agendaForAllShows', function(assert) {
    let result = new dc.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
    let expected = [
      {
        timestamp: createTimestamp('June 29'),
        dateString: createDateString('June 29'),
        performances: [{ timeString: '2pm', fullTitle: 'Show One', shortTitle: 'S1' }],
      },
      {
        timestamp: createTimestamp('June 30'),
        dateString: createDateString('June 30'),
        performances: [
          { timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' },
          { timeString: '8pm', fullTitle: 'Show Two', shortTitle: 'S2' },
        ],
      },
      {
        timestamp: createTimestamp('July 1'),
        dateString: createDateString('July 1'),
        performances: [{ timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }],
      },
      {
        timestamp: createTimestamp('July 2'),
        dateString: createDateString('July 2'),
        performances: [
          { timeString: '10am', fullTitle: 'Show Two', shortTitle: 'S2' },
          { timeString: '2pm', fullTitle: 'Show Two', shortTitle: 'S2' },
        ],
      },
      {
        timestamp: createTimestamp('July 6'),
        dateString: createDateString('July 6'),
        performances: [{ timeString: '8pm', fullTitle: 'Show Three', shortTitle: 'S3' }],
      },
    ];
    assert.deepEqual(result.agendaForAllShows, expected);
  });

  test('agendasPerShow', function(assert) {
    let result = new dc.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
    let expected = [
      [
        {
          timestamp: createTimestamp('June 29'),
          dateString: createDateString('June 29'),
          performances: [{ timeString: '2pm', fullTitle: 'Show One', shortTitle: 'S1' }],
        },
        {
          timestamp: createTimestamp('June 30'),
          dateString: createDateString('June 30'),
          performances: [{ timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }],
        },
        {
          timestamp: createTimestamp('July 1'),
          dateString: createDateString('July 1'),
          performances: [{ timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }],
        },
      ],
      [
        {
          timestamp: createTimestamp('June 30'),
          dateString: createDateString('June 30'),
          performances: [{ timeString: '8pm', fullTitle: 'Show Two', shortTitle: 'S2' }],
        },
        {
          timestamp: createTimestamp('July 2'),
          dateString: createDateString('July 2'),
          performances: [
            { timeString: '10am', fullTitle: 'Show Two', shortTitle: 'S2' },
            { timeString: '2pm', fullTitle: 'Show Two', shortTitle: 'S2' },
          ],
        },
      ],
      [
        {
          timestamp: createTimestamp('July 6'),
          dateString: createDateString('July 6'),
          performances: [{ timeString: '8pm', fullTitle: 'Show Three', shortTitle: 'S3' }],
        },
      ],
    ];
    assert.deepEqual(result.agendasPerShow, expected);
  });

  test('updating the titles works', function(assert) {
    let showingsData = new dc.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
    const expected = (one: string, two: string, three: string) => [
      {
        timestamp: createTimestamp('June 29'),
        dateString: createDateString('June 29'),
        performances: [{ timeString: '2pm', fullTitle: 'Show One', shortTitle: one }],
      },
      {
        timestamp: createTimestamp('June 30'),
        dateString: createDateString('June 30'),
        performances: [
          { timeString: '8pm', fullTitle: 'Show One', shortTitle: one },
          { timeString: '8pm', fullTitle: 'Show Two', shortTitle: two },
        ],
      },
      {
        timestamp: createTimestamp('July 1'),
        dateString: createDateString('July 1'),
        performances: [{ timeString: '8pm', fullTitle: 'Show One', shortTitle: one }],
      },
      {
        timestamp: createTimestamp('July 2'),
        dateString: createDateString('July 2'),
        performances: [
          { timeString: '10am', fullTitle: 'Show Two', shortTitle: two },
          { timeString: '2pm', fullTitle: 'Show Two', shortTitle: two },
        ],
      },
      {
        timestamp: createTimestamp('July 6'),
        dateString: createDateString('July 6'),
        performances: [{ timeString: '8pm', fullTitle: 'Show Three', shortTitle: three }],
      },
    ];

    showingsData.set('shortTitlesUrl', 'One,Two,Three');
    assert.deepEqual(showingsData.agendaForAllShows, expected('One', 'Two', 'Three'));

    showingsData.set('titles', { short: ['1', '2', '3'], full: showingsData.titles.full });
    assert.deepEqual(showingsData.agendaForAllShows, expected('1', '2', '3'));
  });
});
