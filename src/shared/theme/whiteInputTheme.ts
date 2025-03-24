import { createTheme, light } from "@v-uik/base";

export const whiteInputTheme = createTheme({
  comp: {
    backwardCompatibilityMode: false,
    input: {
      colorBackground: light.ref.palette.white,
      colorBackgroundDisabled: light.ref.palette.gray90,
    },
    comboBox: {
      inputColorBackground: light.ref.palette.white,
      inputColorBackgroundDisabled: light.ref.palette.gray90,
    },
    table: {
      headerColorBackground: light.ref.palette.gray90,
      headerColorBorder: light.ref.palette.gray80,
    },
  },
});
