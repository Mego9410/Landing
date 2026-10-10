import { router } from "expo-router";
import { Linking, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Lede, OnbScreen, Title } from "@/components/Onboarding";
import { radius, space, useColors } from "@/theme";

const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";
/** NICE quality standard QS212, statement 6 (also cited in the website's guides). */
const SOURCE = "https://www.nice.org.uk/guidance/qs212/chapter/quality-statement-6-wraparound-care-alongside-medicines-for-weight-management";

/** 8 · Why it can feel harder now: appetite returning is biology, and support for a year is what UK guidance expects. */
export default function Biology() {
  const c = useColors();
  return (
    <OnbScreen route="biology" ground="lilac" accent="lilacInk" footer={<>
      <Button label="That makes sense" variant="ink" block onPress={() => router.push("/onboarding/matters")} />
      <Button label="Where this comes from" variant="quiet" onPress={() => Linking.openURL(SOURCE)} style={{ alignSelf: "center" }} />
    </>}>
      <View style={{ height: 250, alignItems: "center" }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Svg width={225} height={203} viewBox="0 10 100 90">
          <G transform="rotate(-26 50 80)" opacity={0.18}><Path d={BODY} fill={c.onPastel} /></G>
          <G transform="rotate(-6 50 80)"><Path d={BODY} fill="#E07A52" /><Circle cx={50} cy={64} r={7} fill={c.lilac} /></G>
        </Svg>
        <View style={{ flexDirection: "row", gap: space[2], marginTop: space[3] }}>
          {["Protein", "Strength", "Routine"].map((t) => (
            <View key={t} style={{ backgroundColor: c.surfaceRaised, borderRadius: radius.full, paddingVertical: 5, paddingHorizontal: 11 }}><AppText weight="800" style={{ fontSize: 14 }}>{t}</AppText></View>
          ))}
        </View>
      </View>
      <Title color="onPastel">When the jab stops, appetite usually comes back.</Title>
      <Lede color="onPastel">That’s biology, not something you’re doing wrong. It’s why UK guidance says people should be offered support for at least a year after stopping.</Lede>
      <AppText variant="bodyLg" weight="800" color="onPastel">That’s what the next 12 months are for.</AppText>
    </OnbScreen>
  );
}
