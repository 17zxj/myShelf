import defaultSettings from '../defaultSettings';

const updateTheme = theme => {
  let styleLink = document.getElementById('theme-style');
  let hrefSrc = `./theme/${theme}.css`;

  if (styleLink) {
    styleLink.href = hrefSrc;
  } else {
    styleLink = document.createElement('link');

    styleLink.type = 'text/css';
    styleLink.rel = 'stylesheet';
    styleLink.id = 'theme-style';
    styleLink.href = hrefSrc;
    document.body.append(styleLink);
  }
};

const updateColorWeak = colorWeak => {
  document.body.className = colorWeak ? 'colorWeak' : '';
};

let themeData = defaultSettings;
if (localStorage.getItem('smart-theme')) {
  themeData = JSON.parse(localStorage.getItem('smart-theme'));
}

if (themeData) {
  const { theme, colorWeak } = themeData;
  updateTheme(theme);
  updateColorWeak(colorWeak);
}
export default {
  namespace: 'setting',
  state: themeData,
  reducers: {
    getSetting(state) {
      const setting = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value === '1' ? true : value;
        }
      });
      const { theme, colorWeak } = setting;
      if (state.theme !== theme) {
        updateTheme(theme);
      }
      updateColorWeak(colorWeak);

      return {
        ...state,
        ...setting,
      };
    },
    changeSetting(state, { payload }) {
      const urlParams = new URL(window.location.href);
      Object.keys(defaultSettings).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          urlParams.searchParams.delete(key);
        }
      });
      Object.keys(payload).forEach(key => {
        if (key === 'collapse') {
          return;
        }
        let value = payload[key];
        if (value === true) {
          value = 1;
        }
        if (defaultSettings[key] !== value) {
          urlParams.searchParams.set(key, value);
        }
      });
      const { theme, colorWeak } = payload;
      if (state.theme !== theme) {
        updateTheme(theme);
      }
      updateColorWeak(colorWeak);
      localStorage.setItem('smart-theme', JSON.stringify({ ...state, ...payload }));
      return {
        ...state,
        ...payload,
      };
    },
  },
};
