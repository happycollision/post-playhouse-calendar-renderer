import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';
import { IDayShowings } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { assert } from '@ember/debug';

@tagName('')
export default class ShowCounts extends Component {
  shorthandPerShow!: IDayShowings[][];

  init() {
    super.init();
    assert('shorthand was passed in', Array.isArray(this.shorthandPerShow));
  }

  @computed('shorthandPerShow')
  get allShowings() {
    return this.shorthandPerShow.map(so => {
      return so.reduce((a, day) => {
        if (day.m) ++a;
        if (day.a) ++a;
        if (day.e) ++a;
        return a;
      }, 0);
    });
  }

  @computed('shorthandPerShow')
  get afternoonShowings() {
    return this.shorthandPerShow.map(so => {
      return so.reduce((a, day) => {
        if (day.a) ++a;
        return a;
      }, 0);
    });
  }

  @computed('shorthandPerShow')
  get morningShowings() {
    return this.shorthandPerShow.map(so => {
      return so.reduce((a, day) => {
        if (day.m) ++a;
        return a;
      }, 0);
    });
  }

  @computed('shorthandPerShow')
  get eveningShowings() {
    return this.shorthandPerShow.map(so => {
      return so.reduce((a, day) => {
        if (day.e) ++a;
        return a;
      }, 0);
    });
  }
}
