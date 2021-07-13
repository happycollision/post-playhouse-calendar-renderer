'use strict';

define('post-playhouse-calendar-renderer/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/keyboard-press.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/keyboard-press.js should pass ESLint\n\n');
  });

  QUnit.test('components/p-calendar/day.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/p-calendar/day.js should pass ESLint\n\n');
  });

  QUnit.test('components/p-calendar/week.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/p-calendar/week.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });
});
define('post-playhouse-calendar-renderer/tests/helpers/ember-keyboard/register-test-helpers', ['exports', 'ember-keyboard', 'ember-keyboard/fixtures/modifiers-array', 'ember-keyboard/fixtures/mouse-buttons-array', 'ember-keyboard/utils/get-cmd-key'], function (exports, _emberKeyboard, _modifiersArray, _mouseButtonsArray, _getCmdKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    Ember.Test.registerAsyncHelper('keyDown', function (app, attributes, element) {
      return keyEvent(app, attributes, 'keydown', element);
    });

    Ember.Test.registerAsyncHelper('keyUp', function (app, attributes, element) {
      return keyEvent(app, attributes, 'keyup', element);
    });

    Ember.Test.registerAsyncHelper('keyPress', function (app, attributes, element) {
      return keyEvent(app, attributes, 'keypress', element);
    });

    Ember.Test.registerAsyncHelper('mouseDown', function (app, attributes, element) {
      return keyEvent(app, attributes, 'mousedown', element);
    });

    Ember.Test.registerAsyncHelper('mouseUp', function (app, attributes, element) {
      return keyEvent(app, attributes, 'mouseup', element);
    });

    Ember.Test.registerAsyncHelper('touchStart', function (app, attributes, element) {
      return keyEvent(app, attributes, 'touchstart', element);
    });

    Ember.Test.registerAsyncHelper('touchEnd', function (app, attributes, element) {
      return keyEvent(app, attributes, 'touchend', element);
    });
  };

  const keyEvent = function keyEvent(app, attributes, type, element) {
    const event = (attributes || '').split('+').reduce((event, attribute) => {
      if (_modifiersArray.default.indexOf(attribute) > -1) {
        attribute = attribute === 'cmd' ? (0, _getCmdKey.default)() : attribute;
        event[`${attribute}Key`] = true;
      } else if (_mouseButtonsArray.default.indexOf(attribute) > -1) {
        event.button = (0, _emberKeyboard.getMouseCode)(attribute);
      } else {
        event.keyCode = (0, _emberKeyboard.getKeyCode)(attribute);
      }

      return event;
    }, {});

    return app.testHelpers.triggerEvent(element || document.body, type, event);
  };
});
define('post-playhouse-calendar-renderer/tests/integration/components/keyboard-press-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'ember-keyboard'], function (_qunit, _emberQunit, _testHelpers, _emberKeyboard) {
  'use strict';

  (0, _qunit.module)('Integration | Component | keyboard press', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      (0, _emberKeyboard.initialize)();
    });

    (0, _qunit.test)('it calls the action on the given key press', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+uRhg2N2",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"keyboard-press\",null,[[\"key\",\"onDown\"],[\"KeyJ\",[27,\"action\",[[22,0,[]],[27,\"mut\",[[23,[\"pressed\"]]],null],true],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      (0, _emberKeyboard.triggerKeyDown)('KeyJ');

      assert.equal(this.pressed, true);
    });
  });
});
define('post-playhouse-calendar-renderer/tests/integration/components/p-calendar-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'post-playhouse-calendar-renderer/utils/showings-data-converters', 'post-playhouse-calendar-renderer/tests/test-data'], function (_qunit, _emberQunit, _testHelpers, _showingsDataConverters, _testData) {
  'use strict';

  (0, _qunit.module)('Integration | Component | p calendar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('showings', new _showingsDataConverters.ShowingsData(_testData.DEFAULT_TITLES, _testData.DEFAULT_LONG_TITLES, _testData.DEFAULT_DATES));

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "FWpS5ZSQ",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"p-calendar\",null,[[\"showingsData\"],[[23,[\"showings\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok(true);
    });
  });
});
define('post-playhouse-calendar-renderer/tests/integration/components/p-calendar/day-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'post-playhouse-calendar-renderer/utils/showings-data-converters'], function (_qunit, _emberQunit, _testHelpers, _showingsDataConverters) {
  'use strict';

  (0, _qunit.module)('Integration | Component | p calendar/day', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      const setData = (shows = [], day = 'Sunday', date = 1, month = 'Jun') => {
        this.set('dayNameFull', day);
        this.set('monthName', month);
        this.set('mDay', date);
        this.set('shows', shows);
      };
      setData();

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Ihdw+IMM",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"p-calendar/day\",null,[[\"dayNameFull\",\"mDay\",\"monthName\",\"shows\"],[[23,[\"dayNameFull\"]],[23,[\"mDay\"]],[23,[\"monthName\"]],[23,[\"shows\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok(true);
    });

    (0, _qunit.test)('it highlights days with possible issues', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      const setData = (shows = [], day = 'Sunday', date = 1, month = 'Jun') => {
        this.set('dayNameFull', day);
        this.set('monthName', month);
        this.set('mDay', date);
        this.set('shows', shows);
      };
      setData();
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "lKIRjCKB",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"p-calendar/day\",null,[[\"dayNameFull\",\"mDay\",\"monthName\",\"shows\",\"isEditing\"],[[23,[\"dayNameFull\"]],[23,[\"mDay\"]],[23,[\"monthName\"]],[23,[\"shows\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      setData([new _showingsDataConverters.ShowData(1, '2p', { 1: 'Some Show' }), new _showingsDataConverters.ShowData(2, '8p', { 1: 'Some Other Show' })], 'Sunday');
      assert.dom('.day').hasClass('error', 'error when sunday has a second show');

      setData([new _showingsDataConverters.ShowData(1, '10a', { 1: 'Some Show' })], 'Sunday');
      assert.dom('.day').hasClass('error', 'error when sunday showtime is not 2pm');

      setData([new _showingsDataConverters.ShowData(1, '2p', { 1: 'Some Show' })], 'Sunday');
      assert.dom('.day').hasNoClass('error', 'no error when sunday showtime is 2pm');

      setData([new _showingsDataConverters.ShowData(1, '10a', { 1: 'Some Show' })], 'Friday');
      assert.dom('.day').hasClass('error', 'error when 10am is not Saturday');

      setData([new _showingsDataConverters.ShowData(1, '2p', { 1: 'Some Show' }), new _showingsDataConverters.ShowData(2, '2p', { 1: 'Some Other Show' })]);
      assert.dom('.day').hasClass('error', 'multiple showings at the same time');
    });
  });
});
define('post-playhouse-calendar-renderer/tests/integration/components/p-calendar/week-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | p calendar/week', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.render(Ember.HTMLBars.template({
        "id": "4pBnvqon",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"p-calendar/week\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok(true);
    });
  });
});
define('post-playhouse-calendar-renderer/tests/integration/components/show-counts-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'post-playhouse-calendar-renderer/utils/showings-data-converters'], function (_qunit, _emberQunit, _testHelpers, _showingsDataConverters) {
    'use strict';

    (0, _qunit.module)('Integration | Component | show-counts', function (hooks) {
        (0, _emberQunit.setupRenderingTest)(hooks);
        (0, _qunit.test)('it renders', async function (assert) {
            const showingsData = new _showingsDataConverters.ShowingsData('First show,Second show,Third show', 'First show,Second show,Third show', '[1]a2b3c3[2]b3d2[3]h1');
            this.set('titles', ['First show', 'Second show', 'Third show']);
            this.set('showingsData', showingsData);
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "hiWfpoeL",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"show-counts\",null,[[\"showingsData\"],[[23,[\"showingsData\"]]]]],false]],\"hasEval\":false}",
                "meta": {}
            }));
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
});
define('post-playhouse-calendar-renderer/tests/integration/components/showing-list-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'post-playhouse-calendar-renderer/tests/test-data', 'post-playhouse-calendar-renderer/utils/showings-data-converters'], function (_qunit, _emberQunit, _testHelpers, _testData, _showingsDataConverters) {
  'use strict';

  (0, _qunit.module)('Integration | Component | showing-list', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      this.set('showingsData', new _showingsDataConverters.ShowingsData(_testData.DEFAULT_TITLES, _testData.DEFAULT_LONG_TITLES, _testData.DEFAULT_DATES));
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ppg/unp4",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"showing-list\",null,[[\"showingsData\"],[[23,[\"showingsData\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.ok(this.element);
    });
    (0, _qunit.test)('it shows all the show titles', async function (assert) {
      this.set('showingsData', new _showingsDataConverters.ShowingsData(_testData.DEFAULT_TITLES, _testData.DEFAULT_LONG_TITLES, _testData.DEFAULT_DATES));
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ppg/unp4",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"showing-list\",null,[[\"showingsData\"],[[23,[\"showingsData\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.dom().containsText('Mermaid');
      assert.dom().containsText('Footloose');
      assert.dom().containsText('Chitty Chitty');
      assert.dom().containsText('Urinetown');
      assert.dom().containsText('42nd');
    });
    (0, _qunit.test)('it shows all the show dates', async function (assert) {
      this.set('showingsData', new _showingsDataConverters.ShowingsData(_testData.DEFAULT_TITLES, _testData.DEFAULT_LONG_TITLES, _testData.DEFAULT_DATES));
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ppg/unp4",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"showing-list\",null,[[\"showingsData\"],[[23,[\"showingsData\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      (0, _showingsDataConverters.fullCodeStringToPublishable)(_testData.DEFAULT_DATES).map(str => {
        str.split('\n').map(str => assert.dom().containsText(str.trim()));
      });
    });
    (0, _qunit.test)('it shows groupings by price points', async function (assert) {
      // Here is what these dates would be in 2018
      // One
      //   June Wed 20, Fri 22, Sun 24*
      //   July Sat 28*, Tue 31
      // Two
      //   June Sun 10*, Wed 13, Tue 19
      //   July Sat 7*, Thu 12, Tue 17, Fri 20
      const dates = '2018-06-01' + '[1]t3v3x20B2E3' + '[2]j2m3s30g2l3q3t3';
      this.set('showingsData', new _showingsDataConverters.ShowingsData('One,Two', 'One,Two', dates));
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ppg/unp4",
        "block": "{\"symbols\":[],\"statements\":[[1,[27,\"showing-list\",null,[[\"showingsData\"],[[23,[\"showingsData\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
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
});
define('post-playhouse-calendar-renderer/tests/integration/helpers/fallback-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
    'use strict';

    (0, _qunit.module)('Integration | Helper | fallback', function (hooks) {
        (0, _emberQunit.setupRenderingTest)(hooks);
        // Replace this with your real tests.
        (0, _qunit.test)('it returns the first non-null/non-undefined value in a list', async function (assert) {
            this.setProperties({
                zero: 0,
                false: false,
                negative: -1,
                nulled: null,
                undef: undefined,
                emptyString: '',
                emptyObj: {},
                text: 'hello'
            });
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "bOOe2yct",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"nulled\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), 'hello', 'passes over null to text');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "fD1UseMk",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"zero\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), '0', 'counts zero as a value');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "oTZEFQD7",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"negative\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), '-1', 'counts -1 as a value');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "bq3VwibV",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"emptyString\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), '', 'returns an empty string... but that always checks out I think');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "crXbUdDe",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[false,[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), 'false', 'counts false as a value');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "1PZwdIii",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"emptyObj\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), '[object Object]', 'passes along the empty object');
            await (0, _testHelpers.render)(Ember.HTMLBars.template({
                "id": "/C0xnsqI",
                "block": "{\"symbols\":[],\"statements\":[[1,[27,\"fallback\",[[23,[\"nulled\"]],[23,[\"undef\"]],[23,[\"text\"]]],null],false]],\"hasEval\":false}",
                "meta": {}
            }));
            assert.equal(this.element.textContent.trim(), 'hello', 'allows multiple passthroughs');
        });
    });
});
define('post-playhouse-calendar-renderer/tests/test-data', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const DEFAULT_TITLES = exports.DEFAULT_TITLES = 'Mermaid,Footloose,Chitty,Urinetown,42nd St';
    const DEFAULT_LONG_TITLES = exports.DEFAULT_LONG_TITLES = "Disney's The Little Mermaid,Footloose,Chitty Chitty Bang Bang,Urinetown,42nd Street";
    const DEFAULT_DATES = exports.DEFAULT_DATES = '2018-06-01' + '[1]a3b3c2e3l3t3v3x20d3n3r3u1v2y2B2E30d1h2k1l2p3r2' + '[2]h3i3j2m3s3w3A30g2l3q3t3z3C20b3d3j3o2' + '[3]o3p3q2u3z30c3k2m2o2u2x3B10a3d2g3i3k3q3s2' + '[4]C3D30a2k3m3s3A30c3h3k2n3r3' + '[5]0f3g3h2j3n2r2u3y3B30a2e2o3';
});
define('post-playhouse-calendar-renderer/tests/test-helper', ['post-playhouse-calendar-renderer/app', 'post-playhouse-calendar-renderer/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('post-playhouse-calendar-renderer/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('integration/components/keyboard-press-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/keyboard-press-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/p-calendar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/p-calendar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/p-calendar/day-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/p-calendar/day-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/p-calendar/week-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/p-calendar/week-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });
});
define('post-playhouse-calendar-renderer/tests/unit/controllers/index-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:index');
      assert.ok(controller);
    });
  });
});
define('post-playhouse-calendar-renderer/tests/unit/routes/index-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:index');
      assert.ok(route);
    });
  });
});
define('post-playhouse-calendar-renderer/tests/unit/utils/showings-data-converters-test', ['post-playhouse-calendar-renderer/utils/showings-data-converters', 'qunit', 'post-playhouse-calendar-renderer/tests/test-data', 'luxon'], function (_showingsDataConverters, _qunit, _testData, _luxon) {
    'use strict';

    const LONG_TITLES = 'Show One,Show Two,Show Three';
    const SHORT_TITLES = 'S1,S2,S3';
    const URL_DATES_CODE = '2018-06-29' + '[1]C2D30a3' + '[2]D30d4' + '[3]0f3';
    const READABLE_DATES = () => [`2018
June 29a, 30e,
July 1e,`, `2018
June 30e,
July 4ma,`, `2018
July 6e,`];
    const PUBLISHABLE_DATES = () => [`June 29*, 30
July 1`, `June 30
July 4‡, 4*`, `July 6`];
    const SHORTHAND = () => ({
        startingDate: '2018-06-29',
        showData: [{ a: [1] }, { e: [1, 2] }, { e: [1] }, {}, {}, { m: [2], a: [2] }, {}, { e: [3] }]
    });
    function numDaysWithShowings(showings) {
        return showings.reduce((count, showing) => {
            if (showing.a || showing.e || showing.m) return count + 1;
            return count;
        }, 0);
    }
    (0, _qunit.module)('Unit | Utility | showings-data-converters | simple functions', function () {
        (0, _qunit.test)('urlToShorthandPerShow', function (assert) {
            let result = _showingsDataConverters._urlToShorthandPerShow(URL_DATES_CODE);
            let expected = [[{ a: [1] }, { e: [1] }, { e: [1] }], [{}, { e: [2] }, {}, {}, {}, { m: [2], a: [2] }], [{}, {}, {}, {}, {}, {}, {}, { e: [3] }]];
            assert.deepEqual(result, expected, 'show data looks correct');
        });
        (0, _qunit.test)('urlToShorthand', function (assert) {
            let result = _showingsDataConverters.urlToShorthand(URL_DATES_CODE);
            assert.equal(numDaysWithShowings(result.showData), 5, 'has correct number of showings');
            assert.equal(result.startingDate, '2018-06-29', 'has the correct starting date');
            assert.deepEqual(result.showData, SHORTHAND().showData, 'show data looks correct');
        });
        (0, _qunit.test)('shorthandToUrl', function (assert) {
            let result = _showingsDataConverters.shorthandToUrl(SHORTHAND());
            assert.equal(result, URL_DATES_CODE);
        });
        (0, _qunit.test)('urlCodeParts', function (assert) {
            let result = _showingsDataConverters._urlCodeParts(URL_DATES_CODE);
            assert.deepEqual(result, { startingDateString: '2018-06-29', showsDates: ['C2D30a3', 'D30d4', '0f3'] });
        });
        (0, _qunit.test)('dateCodeStringToTokens', function (assert) {
            let result = _showingsDataConverters._dateCodeStringToTokens(_showingsDataConverters._urlCodeParts(URL_DATES_CODE).showsDates.join(''));
            assert.deepEqual(result, ['C2', 'D3', '0', 'a3', 'D3', '0', 'd4', '0', 'f3']);
        });
    });
    (0, _qunit.module)('Unit | Utility | showings-data-converters | big converters', function () {
        (0, _qunit.test)('fullCodeStringToReadable', function (assert) {
            let result = _showingsDataConverters.fullCodeStringToReadable(URL_DATES_CODE);
            assert.deepEqual(result, READABLE_DATES());
        });
        (0, _qunit.test)('fullCodeStringToPublishable', function (assert) {
            let result = _showingsDataConverters.fullCodeStringToPublishable(URL_DATES_CODE);
            assert.deepEqual(result, PUBLISHABLE_DATES());
        });
        (0, _qunit.test)('readablesToUrl', function (assert) {
            let result = _showingsDataConverters.readablesToUrl(READABLE_DATES());
            assert.equal(result, URL_DATES_CODE);
        });
        (0, _qunit.test)('urlDataToShowingsLists', function (assert) {
            let result = _showingsDataConverters._urlDataToShowingsLists(LONG_TITLES, URL_DATES_CODE);
            let expected = [{
                title: 'Show One',
                dates: 'June 29*, 30\nJuly 1'
            }, {
                title: 'Show Two',
                dates: 'June 30\nJuly 4‡, 4*'
            }, {
                title: 'Show Three',
                dates: 'July 6'
            }];
            assert.deepEqual(result, expected);
        });
        (0, _qunit.test)('urlDataToShowingsAgenda', function (assert) {
            let result = _showingsDataConverters.urlDataToShowingsAgenda(LONG_TITLES, URL_DATES_CODE);
            let expected = [{
                dateString: 'June 29',
                performances: [{ timeString: '2pm', title: 'Show One' }]
            }, {
                dateString: 'June 30',
                performances: [{ timeString: '8pm', title: 'Show One' }, { timeString: '8pm', title: 'Show Two' }]
            }, {
                dateString: 'July 1',
                performances: [{ timeString: '8pm', title: 'Show One' }]
            }, {
                dateString: 'July 4',
                performances: [{ timeString: '10am', title: 'Show Two' }, { timeString: '2pm', title: 'Show Two' }]
            }, {
                dateString: 'July 6',
                performances: [{ timeString: '8pm', title: 'Show Three' }]
            }];
            assert.deepEqual(result, expected);
        });
    });
    (0, _qunit.module)('Unit | Utility | showings-data-converters | real data ', function () {
        const REAL_URL_DATES_CODE = '2019-05-31[1]E30a3b2d3k3s3u3w20c3m3q3t1u2x2A2D30c1g2j1k2o3q2[2]E30g3h3i2l3r3v3z30f2k3p3s3y3B20a3c3i3n2[3]0n3o3p2t3y30b3j2l2n2t2w3A1E30c2f3h3j3p3r2[4]0B3C3D20j3l3r3z30b3g3j2m3q3[5]00e3f3g2i3m2q2t3x3A3E20d2n3';
        const REAL_READABLE_DATES = () => [`2019
May 31e,
June 1e, 2a, 4e, 11e, 19e, 21e, 23a,
July 3e, 13e, 17e, 20m, 21a, 24a, 27a, 30e,
August 3m, 7a, 10m, 11a, 15e, 17a,`, `2019
May 31e,
June 7e, 8e, 9a, 12e, 18e, 22e, 26e,
July 6a, 11e, 16e, 19e, 25e, 28a,
August 1e, 3e, 9e, 14a,`, `2019
June 14e, 15e, 16a, 20e, 25e,
July 2e, 10a, 12a, 14a, 20a, 23e, 27m, 31e,
August 3a, 6e, 8e, 10e, 16e, 18a,`, `2019
June 28e, 29e, 30a,
July 10e, 12e, 18e, 26e,
August 2e, 7e, 10a, 13e, 17e,`, `2019
July 5e, 6e, 7a, 9e, 13a, 17a, 20e, 24e, 27e, 31a,
August 4a, 14e,`];
        const REAL_PUBLISHABLE_DATES = () => [`May 31
June 1, 2*, 4, 11, 19, 21, 23*
July 3, 13, 17, 20‡, 21*, 24*, 27*, 30
August 3‡, 7*, 10‡, 11*, 15, 17*`, `May 31
June 7, 8, 9*, 12, 18, 22, 26
July 6*, 11, 16, 19, 25, 28*
August 1, 3, 9, 14*`, `June 14, 15, 16*, 20, 25
July 2, 10*, 12*, 14*, 20*, 23, 27‡, 31
August 3*, 6, 8, 10, 16, 18*`, `June 28, 29, 30*
July 10, 12, 18, 26
August 2, 7, 10*, 13, 17`, `July 5, 6, 7*, 9, 13*, 17*, 20, 24, 27, 31*
August 4*, 14`];
        const REAL_SHOWINGS_AGENDA_FROM_DEFAULTS = [{
            dateString: 'June 1',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 2',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 3',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 5',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 8',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 9',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 10',
            performances: [{ timeString: '2pm', title: 'Footloose' }]
        }, {
            dateString: 'June 12',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 13',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 15',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'June 16',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'June 17',
            performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'June 19',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 20',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 21',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'June 22',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 23',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 24',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'June 26',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'June 27',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'June 29',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'June 30',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 1',
            performances: [{ timeString: '2pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 3',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'July 4',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'July 6',
            performances: [{ timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 7',
            performances: [{ timeString: '2pm', title: 'Footloose' }, { timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 8',
            performances: [{ timeString: '2pm', title: '42nd Street' }]
        }, {
            dateString: 'July 10',
            performances: [{ timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 11',
            performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }, { timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 12',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'July 13',
            performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }, { timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 14',
            performances: [{ timeString: '2pm', title: '42nd Street' }, { timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'July 15',
            performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'July 17',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'July 18',
            performances: [{ timeString: '2pm', title: '42nd Street' }, { timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'July 19',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 20',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'July 21',
            performances: [{ timeString: '10am', title: "Disney's The Little Mermaid" }, { timeString: '2pm', title: 'Chitty Chitty Bang Bang' }, { timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 22',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'July 24',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'July 25',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }, { timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 26',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'July 27',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'July 28',
            performances: [{ timeString: '10am', title: 'Chitty Chitty Bang Bang' }, { timeString: '2pm', title: "Disney's The Little Mermaid" }, { timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'July 29',
            performances: [{ timeString: '2pm', title: 'Footloose' }]
        }, {
            dateString: 'July 31',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'August 1',
            performances: [{ timeString: '2pm', title: '42nd Street' }, { timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'August 2',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'August 3',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'August 4',
            performances: [{ timeString: '10am', title: "Disney's The Little Mermaid" }, { timeString: '2pm', title: 'Chitty Chitty Bang Bang' }, { timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'August 5',
            performances: [{ timeString: '2pm', title: '42nd Street' }]
        }, {
            dateString: 'August 7',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'August 8',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }, { timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'August 9',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'August 10',
            performances: [{ timeString: '8pm', title: 'Footloose' }]
        }, {
            dateString: 'August 11',
            performances: [{ timeString: '10am', title: "Disney's The Little Mermaid" }, { timeString: '2pm', title: 'Urinetown' }, { timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'August 12',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'August 14',
            performances: [{ timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'August 15',
            performances: [{ timeString: '2pm', title: 'Footloose' }, { timeString: '8pm', title: '42nd Street' }]
        }, {
            dateString: 'August 16',
            performances: [{ timeString: '8pm', title: "Disney's The Little Mermaid" }]
        }, {
            dateString: 'August 17',
            performances: [{ timeString: '8pm', title: 'Chitty Chitty Bang Bang' }]
        }, {
            dateString: 'August 18',
            performances: [{ timeString: '2pm', title: "Disney's The Little Mermaid" }, { timeString: '8pm', title: 'Urinetown' }]
        }, {
            dateString: 'August 19',
            performances: [{ timeString: '2pm', title: 'Chitty Chitty Bang Bang' }]
        }];
        (0, _qunit.test)('this data actually matches MY thinking', function (assert) {
            const tokens = _showingsDataConverters._dateCodeStringToTokens(_showingsDataConverters._urlCodeParts(REAL_URL_DATES_CODE).showsDates.join('')).filter(t => t !== '0');
            const showings = REAL_READABLE_DATES().join(' ').match(/\d{1,2}[aem]/g);
            const idTokens = tokens.map(t => _showingsDataConverters._idTokenToShowingToken(t));
            assert.deepEqual(showings, idTokens);
        });
        (0, _qunit.test)('fullCodeStringToReadable', function (assert) {
            let result = _showingsDataConverters.fullCodeStringToReadable(REAL_URL_DATES_CODE);
            assert.deepEqual(result, REAL_READABLE_DATES());
        });
        (0, _qunit.test)('fullCodeStringToPublishable', function (assert) {
            let result = _showingsDataConverters.fullCodeStringToPublishable(REAL_URL_DATES_CODE);
            assert.deepEqual(result, REAL_PUBLISHABLE_DATES());
        });
        (0, _qunit.test)('readablesToUrl', function (assert) {
            let result = _showingsDataConverters.readablesToUrl(REAL_READABLE_DATES());
            assert.deepEqual(result, REAL_URL_DATES_CODE);
        });
        (0, _qunit.test)('urlDataToShowingsAgenda', function (assert) {
            let result = _showingsDataConverters.urlDataToShowingsAgenda(_testData.DEFAULT_LONG_TITLES, _testData.DEFAULT_DATES);
            assert.deepEqual(result, REAL_SHOWINGS_AGENDA_FROM_DEFAULTS);
        });
    });
    (0, _qunit.module)('Unit | Utility | ShowingsData class', function () {
        const createTimestamp = str => _luxon.DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toMillis();
        const createDateString = str => _luxon.DateTime.fromFormat(`${str}, 2018`, 'LLLL d, yyyy').toFormat('LLLL d');
        (0, _qunit.test)('it initializes', function (assert) {
            assert.ok(new _showingsDataConverters.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE));
        });
        (0, _qunit.test)('agendaForAllShows', function (assert) {
            let result = new _showingsDataConverters.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
            let expected = [{
                timestamp: createTimestamp('June 29'),
                dateString: createDateString('June 29'),
                performances: [{ hourOfDay: 14, timeString: '2pm', fullTitle: 'Show One', shortTitle: 'S1' }]
            }, {
                timestamp: createTimestamp('June 30'),
                dateString: createDateString('June 30'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }, { hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Two', shortTitle: 'S2' }]
            }, {
                timestamp: createTimestamp('July 1'),
                dateString: createDateString('July 1'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }]
            }, {
                timestamp: createTimestamp('July 4'),
                dateString: createDateString('July 4'),
                performances: [{ hourOfDay: 10, timeString: '10am', fullTitle: 'Show Two', shortTitle: 'S2' }, { hourOfDay: 14, timeString: '2pm', fullTitle: 'Show Two', shortTitle: 'S2' }]
            }, {
                timestamp: createTimestamp('July 6'),
                dateString: createDateString('July 6'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Three', shortTitle: 'S3' }]
            }];
            assert.deepEqual(result.agendaForAllShows, expected);
        });
        (0, _qunit.test)('agendasPerShow', function (assert) {
            let result = new _showingsDataConverters.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
            let expected = [[{
                timestamp: createTimestamp('June 29'),
                dateString: createDateString('June 29'),
                performances: [{ hourOfDay: 14, timeString: '2pm', fullTitle: 'Show One', shortTitle: 'S1' }]
            }, {
                timestamp: createTimestamp('June 30'),
                dateString: createDateString('June 30'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }]
            }, {
                timestamp: createTimestamp('July 1'),
                dateString: createDateString('July 1'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: 'S1' }]
            }], [{
                timestamp: createTimestamp('June 30'),
                dateString: createDateString('June 30'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Two', shortTitle: 'S2' }]
            }, {
                timestamp: createTimestamp('July 4'),
                dateString: createDateString('July 4'),
                performances: [{ hourOfDay: 10, timeString: '10am', fullTitle: 'Show Two', shortTitle: 'S2' }, { hourOfDay: 14, timeString: '2pm', fullTitle: 'Show Two', shortTitle: 'S2' }]
            }], [{
                timestamp: createTimestamp('July 6'),
                dateString: createDateString('July 6'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Three', shortTitle: 'S3' }]
            }]];
            assert.deepEqual(result.agendasPerShow, expected);
        });
        (0, _qunit.test)('updating the titles works', function (assert) {
            let showingsData = new _showingsDataConverters.ShowingsData(SHORT_TITLES, LONG_TITLES, URL_DATES_CODE);
            const expected = (one, two, three) => [{
                timestamp: createTimestamp('June 29'),
                dateString: createDateString('June 29'),
                performances: [{ hourOfDay: 14, timeString: '2pm', fullTitle: 'Show One', shortTitle: one }]
            }, {
                timestamp: createTimestamp('June 30'),
                dateString: createDateString('June 30'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: one }, { hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Two', shortTitle: two }]
            }, {
                timestamp: createTimestamp('July 1'),
                dateString: createDateString('July 1'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show One', shortTitle: one }]
            }, {
                timestamp: createTimestamp('July 4'),
                dateString: createDateString('July 4'),
                performances: [{ hourOfDay: 10, timeString: '10am', fullTitle: 'Show Two', shortTitle: two }, { hourOfDay: 14, timeString: '2pm', fullTitle: 'Show Two', shortTitle: two }]
            }, {
                timestamp: createTimestamp('July 6'),
                dateString: createDateString('July 6'),
                performances: [{ hourOfDay: 20, timeString: '8pm', fullTitle: 'Show Three', shortTitle: three }]
            }];
            showingsData.set('shortTitlesUrl', 'One,Two,Three');
            assert.deepEqual(showingsData.agendaForAllShows, expected('One', 'Two', 'Three'));
            showingsData.set('titles', { short: ['1', '2', '3'], full: showingsData.titles.full });
            assert.deepEqual(showingsData.agendaForAllShows, expected('1', '2', '3'));
        });
    });
});
define('post-playhouse-calendar-renderer/config/environment', [], function() {
  if (typeof FastBoot !== 'undefined') {
return FastBoot.config('post-playhouse-calendar-renderer');
} else {
var prefix = 'post-playhouse-calendar-renderer';try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

}
});

require('post-playhouse-calendar-renderer/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
