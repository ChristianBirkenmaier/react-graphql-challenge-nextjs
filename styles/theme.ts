import { extendTheme } from "@chakra-ui/react";

// Custom colors
const colors = {};

// Chakra component stylings / overwritings
const components = {};

// Custom html body style
const styles = {
  global: {
    body: { margin: "1rem" },
  },
};

// Combinig all together with extendTheme, to create a full chakra-theme to use.
const theme = extendTheme({
  colors,
  components,
  styles,
});

export default theme;
