import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings from "./global.js";
import { breakpointValues } from "./global.js";

export const colors = {
  gold: {
    500: "#FFBC45",
    600: "#F0A72C",
    100: "#ffdca8",
  },
  common: {
    white: "#FFFFFF",
    black: "#000",
    gray: "#838A91",
    red: "#FF4F4F",
  },
  dark: {
    500: "#11161D",
    600: "#aaa",
    700: "#344750",
    800: "#232E33",
    900: "#182328",
  },
  black: {
    400: "#4A596C",
    800: "#232A33",
    900: "#11161D",
    1000: "#000000",
  },
  blue: {
    500: "#2E5CFF",
  },
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      breakpoints: {
        values: breakpointValues,
      },
      primary: {
        main: colors.common.white,
      },
      palette: {
        type: "dark",
        background: {
          default: colors.dark[500],
        },
        primary: {
          main: colors.common.white,
        },
        text: {
          primary: colors.common.white,
          secondary: colors.blue[500], // `${colors.common.white}80`,  // opacity 0.5
          // gold: colors.gold[500],
        },
      },
      typography: {
        fontFamily: "Open Sans",
      },
      props: {
        MuiSvgIcon: {
          htmlColor: colors.common.white,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              // backgroundColor: darkTheme.backgroundColor,
              // background: darkTheme.background,
            },
          },
        },
        MuiDivider: {
          root: {
            backgroundColor: colors.common.white,
          },
        },
        MuiLink: {
          root: {
            color: colors.common.white,
            "&:hover": {
              color: colors.blue[500],
              "&.active": {
                color: colors.blue[500],
              },
            },
            "&.active": {
              color: colors.blue[500],
            },
          },
        },
        MuiAppBar: {
          colorPrimary: {
            color: colors.common.white,
            backgroundColor: colors.dark[900],
          },
        },
        MuiOutlinedInput: {
          root: {
            background: "rgba(255, 255, 255, 0.05)",
            "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
              borderColor: colors.blue[500],
              // Reset on touch devices, it doesn't add specificity
              "@media (hover: none)": {
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
            },
            "&$focused $notchedOutline": {
              borderColor: colors.blue[500],
            },
          },
          notchedOutline: {
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        },
        MuiButton: {
          // startIcon: {
          //   color: colors.gold[500],  button > span.MuiButton-label > span > svg
          // },
          outlinedPrimary: {
            borderColor: colors.dark[700],
            "&:hover": {
              backgroundColor: colors.dark[700],
              borderColor: colors.dark[700],
              "& #menu": {
                color: colors.blue[500],
              },
            },
            // "&:active": {
            //   backgroundColor: colors.dark[700],
            //   borderColor: colors.dark[700],
            //   "& #menu": {
            //     color: colors.gold[500],
            //   },
            // },
          },
          contained: {
            color: colors.dark[900],
            backgroundColor: colors.blue[500],
            // "&:hover": {
            //   backgroundColor: colors.blue[500],
            // },
            // "&:active": {
            //   backgroundColor: colors.blue[500],
            // },
            "@media (hover:none)": {
              color: colors.dark[900],
              backgroundColor: colors.blue[500],
              // "&:hover": {
              //   backgroundColor: colors.blue[500],
              // },
            },
          },
          textPrimary: {
            "&:hover": {
              color: colors.blue[500],
              backgroundColor: "#00000000",
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: colors.blue[500],
          },
          colorSecondary: {
            backgroundColor: colors.blue[500],
          },
        },
        MuiCardActionArea: {
          root: {
            "&:hover $focusHighlight": {
              opacity: 0,
            },
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: colors.dark[900],
            border: "0.5px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(40px)",
          },
        },
        MuiTab: {
          textColorPrimary: {
            opacity: 1,
            color: colors.common.white,
            "&$selected": {
              color: colors.blue[500],
              "& span.MuiTab-wrapper > svg": {
                color: colors.blue[500],
              },
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
