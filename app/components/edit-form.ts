import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import {
  ShowingsData,
  fullCodeStringToReadable,
} from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

export default class EditForm extends Component.extend({
  // anything which *must* be merged to prototype here
}) {
  showingsData!: ShowingsData;
  // normal class body definition here
  @computed('showingsData')
  get readableDates() {
    return fullCodeStringToReadable(this.showingsData.datesUrl);
  }
}
