/**
 * Author: iracanyes
 * Date: 11/14/19
 * Description:
 */
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';

export const messages = {
  'fr': frenchMessages,
  'en': englishMessages
};

export const i18nProvider = locale => {
  if(locale !== 'en')
  {
    return messages[locale];
  }

  return messages['en'];
};
