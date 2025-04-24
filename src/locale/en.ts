import locale from './locale.json';

type LocaleType = {
  [key: string]: {
    en: string;
    zh: string;
  };
};

const typedLocale = locale as LocaleType;

const en: { [key: string]: string } = Object.keys(typedLocale).reduce((acc, key) => {
  acc[key] = typedLocale[key].en;
  return acc;
}, {} as { [key: string]: string });

export default en;

