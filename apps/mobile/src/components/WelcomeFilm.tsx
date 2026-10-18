// The welcome screen's film: a silent 12-second loop of the real app (film/welcome-loop), made for this spot. It's drawn
// on the page's own ground, light or dark to match the phone, so only the phone and the shapes around it show, and the
// bottom of the phone fades into the page above the headline. It never plays sound and never stops other audio.
// Until the first frame is drawn, and for anyone who has turned on Reduce Motion, it shows the loop's first frame.
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo, Image, StyleSheet, useColorScheme, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const FILM = {
  light: { video: require("../../assets/film/welcome-loop-light.mp4"), still: require("../../assets/film/welcome-loop-light.jpg") },
  dark: { video: require("../../assets/film/welcome-loop-dark.mp4"), still: require("../../assets/film/welcome-loop-dark.jpg") },
};
const RATIO = 1350 / 1080; // the loop is 4:5

/** The film at `width` x `height`, cropped to fill, its edges faded into `ground` (the page colour). */
export function WelcomeFilm({ width, height, ground }: { width: number; height: number; ground: string }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return <Film key={scheme} scheme={scheme} width={width} height={height} ground={ground} />;
}

function Film({ scheme, width, height, ground }: { scheme: "light" | "dark"; width: number; height: number; ground: string }) {
  const [still, setStill] = useState(true);       // Reduce Motion is on (or not known yet)
  const [drawn, setDrawn] = useState(false);      // the video has drawn its first frame
  const player = useVideoPlayer(FILM[scheme].video, (p) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = "mixWithOthers";
    p.showNowPlayingNotification = false;
  });

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => { if (live) setStill(on); }, () => { if (live) setStill(false); });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setStill);
    return () => { live = false; sub.remove(); };
  }, []);

  // Plays only while the welcome screen is in front and motion is allowed.
  useFocusEffect(useCallback(() => {
    if (still) { player.pause(); return; }
    player.play();
    return () => player.pause();
  }, [player, still]));

  // Full width on a phone; on a wide screen (an iPad) it keeps its 4:5 shape, centred, its ground meeting the page's.
  const filmW = Math.min(width, Math.round(height / RATIO));
  const left = (width - filmW) / 2;
  const top = Math.round(height * 0.06), bottom = Math.round(height * 0.3);
  const fade = (id: string, y1: number, y2: number) => (
    <LinearGradient id={id} x1={0} y1={y1} x2={0} y2={y2}>
      <Stop offset={0} stopColor={ground} stopOpacity={1} />
      <Stop offset={0.4} stopColor={ground} stopOpacity={0.7} />
      <Stop offset={1} stopColor={ground} stopOpacity={0} />
    </LinearGradient>
  );

  return (
    <View style={{ width, height, backgroundColor: ground, overflow: "hidden" }} pointerEvents="none">
      <View style={{ position: "absolute", left, top: 0, width: filmW, height }}>
        <Image source={FILM[scheme].still} style={{ position: "absolute", left: 0, top: 0, width: filmW, height }} resizeMode="cover" />
        {still ? null : (
          <VideoView player={player} style={{ position: "absolute", left: 0, top: 0, width: filmW, height, opacity: drawn ? 1 : 0 }} contentFit="cover"
            nativeControls={false} fullscreenOptions={{ enable: false }} allowsPictureInPicture={false}
            onFirstFrameRender={() => setDrawn(true)} />
        )}
      </View>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>{fade("t", 0, 1)}{fade("b", 1, 0)}</Defs>
        <Rect x={0} y={0} width={width} height={top} fill="url(#t)" />
        <Rect x={0} y={height - bottom} width={width} height={bottom + 1} fill="url(#b)" />
      </Svg>
    </View>
  );
}
