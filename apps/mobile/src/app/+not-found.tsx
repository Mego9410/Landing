import { Link } from "expo-router";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";

export default function NotFound() {
  return (
    <Screen>
      <AppText variant="title">This screen doesn&apos;t exist</AppText>
      <Link href="/"><AppText color="apricotInk" weight="800">Go to Today</AppText></Link>
    </Screen>
  );
}
