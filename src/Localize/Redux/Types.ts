import { IntlShape } from 'react-intl';
import { OptionalIntlConfig } from 'react-intl/src/components/provider';

import { resetLanguage, selectLanguage } from './Actions';
import { AvailableLanguages, AvailableLanguagesExtended } from './Keys';

export interface LocalCountries {
  [key: string]: LocalCountry;
}

export interface LocalCountry {
  code: string;
  name: string;
}

type AvailableTranslationObject = {[key: string]: string};

export interface AvailableTranslations {
  [AvailableLanguages.De]: AvailableTranslationObject;
  [AvailableLanguages.Default]: AvailableTranslationObject;
  [AvailableLanguages.En]: AvailableTranslationObject;
}

export type LocalizeActions = 
  | ReturnType<typeof resetLanguage>
  | ReturnType<typeof selectLanguage>;

export interface LocalizeDispatch {
  <A extends LocalizeActions>(action: A): A;
}
 
type IntlShapeType = IntlShape;

export interface AvailableLanguage extends LocalCountry {
  code: AvailableLanguages;
  enabled: boolean;
  extendedCode: AvailableLanguagesExtended;
  intl: IntlShapeType;
  intlConfig: OptionalIntlConfig;
  name: string;
}

