import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md",
  },
  theme: {
    themes: {
      light: {
        primary: "#d1c4e9",
        primaryLight: "#fff7ff",
        primaryDark: "#a094b7",
        secondary: "#546e7a",
        secondaryDark: "#29434e",
        secondaryLight: "#819ca9",
      },
    },
  },
});
