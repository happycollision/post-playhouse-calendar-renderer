import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';
import { ShowingsData } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';

@tagName('')
export default class ShowCounts extends Component {
  showingsData!: ShowingsData;

  init() {
    super.init();
    assert('showingsData was passed in', !isEmpty(this.showingsData));
  }

  @computed('showingsData')
  get titles(): string[] {
    return this.showingsData.titles.short;
  }

  @computed('showingsData')
  get allShowings() {
    return this.showingsData.agendasPerShow.map(showAgenda =>
      showAgenda.reduce((a, day) => a + day.performances.length, 0),
    );
  }

  @computed('showingsData')
  get afternoonShowings() {
    return this.showingsData.agendasPerShow.map(showAgenda =>
      showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '2pm').length, 0),
    );
  }

  @computed('showingsData')
  get morningShowings() {
    return this.showingsData.agendasPerShow.map(showAgenda =>
      showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '10am').length, 0),
    );
  }

  @computed('showingsData')
  get eveningShowings() {
    return this.showingsData.agendasPerShow.map(showAgenda =>
      showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '8pm').length, 0),
    );
  }
}
