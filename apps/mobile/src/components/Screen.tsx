import { createContext, useContext, useState, type ReactNode } from "react";
import { Animated, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { space, useColors } from "@/theme";

/** How far the screen has scrolled, for the header bar to fade its small title in. */
const ScrollY = createContext<Animated.Value | null>(null);
export const useScrollY = () => useContext(ScrollY);

/** The bar's height below the status bar: 8 above, the 44 point back button, 8 below. */
const BAR = 60;

/** A scrolling screen on the oat surface, clear of the status bar and the floating tab bar. With `header` (usually a
 *  <Header>), that bar stays pinned at the top while the page scrolls under it. */
export function Screen({ children, contentContainerStyle, header, onScroll, ...rest }: ScrollViewProps & { header?: ReactNode }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [y] = useState(() => new Animated.Value(0));
  if (!header) {
    return (
      <ScrollView
        {...rest}
        onScroll={onScroll}
        style={{ flex: 1, backgroundColor: c.surface }}
        contentContainerStyle={[{ paddingTop: insets.top + space[4], paddingHorizontal: 20, paddingBottom: 128, gap: space[6] }, contentContainerStyle]}>
        {children}
      </ScrollView>
    );
  }
  return (
    <ScrollY.Provider value={y}>
      <View style={{ flex: 1, backgroundColor: c.surface }}>
        <Animated.ScrollView
          {...rest}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
            useNativeDriver: true,
            listener: onScroll ? (e: NativeSyntheticEvent<NativeScrollEvent>) => onScroll(e) : undefined,
          })}
          style={{ flex: 1 }}
          contentContainerStyle={[{ paddingTop: insets.top + BAR + space[2], paddingHorizontal: 20, paddingBottom: 128, gap: space[6] }, contentContainerStyle]}>
          {children}
        </Animated.ScrollView>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, paddingTop: insets.top + space[2], paddingBottom: space[2], paddingHorizontal: 20, backgroundColor: c.surface }}>
          {header}
          {/* A hairline once the page has scrolled under the bar. */}
          <Animated.View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, backgroundColor: c.line, opacity: y.interpolate({ inputRange: [0, 16], outputRange: [0, 1], extrapolate: "clamp" }) }} />
        </View>
      </View>
    </ScrollY.Provider>
  );
}
