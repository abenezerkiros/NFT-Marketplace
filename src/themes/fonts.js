import OpenSansLightWOFF from "../styles/fonts/OpenSans-Light.woff";
import OpenSansRegularWOFF from "../styles/fonts/OpenSans-Regular.woff";
import OpenSansBoltWOFF from "../styles/fonts/OpenSans-Bold.woff";
import OpenSansLightWOFF2 from "../styles/fonts/OpenSans-Light.woff2";
import OpenSansRegularWOFF2 from "../styles/fonts/OpenSans-Regular.woff2";
import OpenSansBoltWOFF2 from "../styles/fonts/OpenSans-Bold.woff2";

import RobotoSlabLightWOFF from "../styles/fonts/RobotoSlab-Light.woff";
import RobotoSlabRegularWOFF from "../styles/fonts/RobotoSlab-Regular.woff";
import RobotoSlabBoltWOFF from "../styles/fonts/RobotoSlab-Bold.woff";
import RobotoSlabLightWOFF2 from "../styles/fonts/RobotoSlab-Light.woff2";
import RobotoSlabRegularWOFF2 from "../styles/fonts/RobotoSlab-Regular.woff2";
import RobotoSlabBoltWOFF2 from "../styles/fonts/RobotoSlab-Bold.woff2";

const openSansLight = {
  fontFamily: "Open Sans",
  fontStyle: "light",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
		local('OpenSans-Light'),
		url(${OpenSansLightWOFF}) format('woff'),
		url(${OpenSansLightWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const openSansRegular = {
  fontFamily: "Open Sans",
  fontStyle: "regular",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('OpenSans-Regular'),
		url(${OpenSansRegularWOFF}) format('woff'),
		url(${OpenSansRegularWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const openSansBold = {
  fontFamily: "Open Sans",
  fontStyle: "bold",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
		local('OpenSans-Bold'),
		url(${OpenSansBoltWOFF}) format('woff'),
		url(${OpenSansBoltWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const robotSlabLight = {
  fontFamily: "Roboto Slab",
  fontStyle: "light",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
		local('RobotoSlab-Light'),
		url(${RobotoSlabLightWOFF}) format('woff'),
		url(${RobotoSlabLightWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const robotSlabRegular = {
  fontFamily: "Roboto Slab",
  fontStyle: "regular",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('RobotoSlab-Regular'),
		url(${RobotoSlabRegularWOFF}) format('woff'),
		url(${RobotoSlabRegularWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const robotSlabBold = {
  fontFamily: "Roboto Slab",
  fontStyle: "bold",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
		local('RobotoSlab-Bold'),
		url(${RobotoSlabBoltWOFF}) format('woff'),
		url(${RobotoSlabBoltWOFF2}) format('woff2')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const fonts = [openSansLight, openSansRegular, openSansBold, robotSlabLight, robotSlabRegular, robotSlabBold];

export default fonts;
