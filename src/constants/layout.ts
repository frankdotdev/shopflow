import { Dimensions, Platform } from "react-native";
import { breakpoints } from "./theme";

export function useDeviceInfo() {
  const { width } = Dimensions.get("window");
  const isTablet = width >= breakpoints.tablet;
  const columns = isTablet ? (width >= 1024 ? 4 : 3) : 2;
  const maxContentWidth = isTablet ? 1100 : width;
  return { width, isTablet, columns, maxContentWidth, isAndroid: Platform.OS === "android" };
}
