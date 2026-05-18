// sajilo-app/src/modules/settings/engine/fieldTypes.js
import TextField from './fields/TextField';
import ToggleField from './fields/ToggleField';
import SelectField from './fields/SelectField';
import ReadOnlyField from './fields/ReadOnlyField';
import ActionField from './fields/ActionField';
import PasswordChangeField from './fields/PasswordChangeField';
import RepeatableGroupField from './fields/RepeatableGroupField';

const fieldTypes = {
  text: TextField,
  email: TextField,      // same component, different HTML type
  phone: TextField,
  tel: TextField,
  number: TextField,
  toggle: ToggleField,
  select: SelectField,
  readonly: ReadOnlyField,
  action: ActionField,
  placeholder: ActionField,
  password_change: PasswordChangeField,
  repeatable_group: RepeatableGroupField,
};

export default fieldTypes;