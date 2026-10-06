// Your data: export everything the app keeps as a file, or delete it all. Landing keeps nothing on a server, so these
// two cover the access and erasure rights in the privacy policy. Deleting also withdraws consent and starts again at
// the health information screen.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Share } from "react-native";
import { today } from "@/data/dates";
import { cancelReminders } from "./reminders";
import { freshState, get, replace, STORAGE_KEY } from "./store";

/** Everything the app keeps, as readable JSON with a short note at the top. */
export function exportJson(): string {
  const s = get();
  return JSON.stringify({ exportedOn: today(), note: "Everything the Landing app keeps about you. Weights are in kilograms.", data: s }, null, 2);
}

/** Saves the export to a file and opens the share sheet, so it can go to Files, email or anywhere else. */
export async function shareExport(): Promise<void> {
  const json = exportJson(), name = `landing-data-${today()}.json`;
  if (Platform.OS === "web") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = name;
    a.click();
    return;
  }
  if (await Sharing.isAvailableAsync()) {
    const file = new File(Paths.cache, name);
    if (file.exists) file.delete();
    file.write(json);
    await Sharing.shareAsync(file.uri, { mimeType: "application/json", UTI: "public.json", dialogTitle: "Your Landing data" });
  } else {
    await Share.share({ message: json, title: "Your Landing data" });
  }
}

/** Deletes everything on this phone and starts again. Can't be undone. */
export async function deleteEverything(): Promise<void> {
  await cancelReminders().catch(() => {});
  await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  replace(freshState());
}
