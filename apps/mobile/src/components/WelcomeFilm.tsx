// The welcome screen's film: a silent 7.5-second loop of the app tour, cut from the intro film
// (scripts/welcome-film.sh), set full width at the top of the screen and faded into the page on every side it meets,
// so it reads as part of the screen rather than a video in a box. It never plays sound and never stops other audio.
// Until the first frame is drawn, and for anyone who has turned on Reduce Motion, it shows the loop's first frame.
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo, Image, StyleSheet, useColorScheme, View } from "react-native";
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

const LOOP = require("../../assets/film/welcome-loop.mp4");
const POSTER = require("../../assets/film/welcome-loop-poster.jpg");
const RATIO = 900 / 720; // the loop is 720 x 900

/** The film at `width` x `height`, cropped to fill, faded into `ground` (the page colour) at the edges. */
export function WelcomeFilm({ width, height, ground }: { width: number; height: number; ground: string }) {
  const dark = useColorScheme() === "dark";
  const [still, setStill] = useState(true);       // Reduce Motion is on (or not known yet)
  const [drawn, setDrawn] = useState(false);      // the video has drawn its first frame
  const player = useVideoPlayer(LOOP, (p) => {
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

  // On a phone the film runs edge to edge (cropped a little top and bottom if need be), so its colours meet the screen's
  // edges rather than the page. On a wide screen (an iPad) it keeps its 4:5 shape, centred, and fades out at the sides too.
  const filmW = width < 560 ? width : Math.min(width, height / RATIO);
  const sides = filmW < width - 1;
  const fade = (id: string, x1: number, y1: number, x2: number, y2: number) => (
    <LinearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <Stop offset={0} stopColor={ground} stopOpacity={1} />
      <Stop offset={0.45} stopColor={ground} stopOpacity={0.55} />
      <Stop offset={1} stopColor={ground} stopOpacity={0} />
    </LinearGradient>
  );
  const top = Math.round(height * 0.1), bottom = Math.round(height * 0.28), side = Math.round(filmW * 0.14);
  const left = (width - filmW) / 2;

  return (
    <View style={{ width, height, backgroundColor: ground, overflow: "hidden" }} pointerEvents="none">
      <View style={{ position: "absolute", left, top: 0, width: filmW, height }}>
        <Image source={POSTER} style={{ position: "absolute", left: 0, top: 0, width: filmW, height }} resizeMode="cover" />
        {still ? null : (
          <VideoView player={player} style={{ position: "absolute", left: 0, top: 0, width: filmW, height, opacity: drawn ? 1 : 0 }} contentFit="cover"
            nativeControls={false} fullscreenOptions={{ enable: false }} allowsPictureInPicture={false}
            onFirstFrameRender={() => setDrawn(true)} />
        )}
      </View>
      {dark ? (
        // In dark mode the film's pastel grounds can't melt into the page, so it sits in a soft oval pool of light,
        // a little dimmed, instead of a box with blurred edges.
        <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
          <Defs>
            <RadialGradient id="v" cx={width / 2} cy={height * 0.47} rx={filmW * 0.56} ry={height * 0.55} gradientUnits="userSpaceOnUse">
              <Stop offset={0} stopColor={ground} stopOpacity={0.12} />
              <Stop offset={0.62} stopColor={ground} stopOpacity={0.2} />
              <Stop offset={0.86} stopColor={ground} stopOpacity={0.85} />
              <Stop offset={1} stopColor={ground} stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={width} height={height} fill="url(#v)" />
        </Svg>
      ) : (
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          {fade("t", 0, 0, 0, 1)}
          {fade("b", 0, 1, 0, 0)}
          {fade("l", 0, 0, 1, 0)}
          {fade("r", 1, 0, 0, 0)}
        </Defs>
        <Rect x={0} y={0} width={width} height={top} fill="url(#t)" />
        <Rect x={0} y={height - bottom} width={width} height={bottom + 1} fill="url(#b)" />
        {sides ? <>
          <Rect x={0} y={0} width={left + 1} height={height} fill={ground} />
          <Rect x={left} y={0} width={side} height={height} fill="url(#l)" />
          <Rect x={left + filmW - side} y={0} width={side} height={height} fill="url(#r)" />
          <Rect x={left + filmW - 1} y={0} width={left + 1} height={height} fill={ground} />
        </> : null}
      </Svg>
      )}
    </View>
  );
}
