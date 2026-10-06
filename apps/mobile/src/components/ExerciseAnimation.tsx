import { useEffect, useRef, useState } from "react";
import { View, type ViewStyle } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { byId, castById, frameShapes, poseAt, solve, VIEWBOX, type Shape } from "@landing/motion";

/**
 * An exercise loop from @landing/motion, shown by one of the movement cast and drawn live with react-native-svg so it
 * stays crisp at any size. With reduced motion on, or while paused, it holds the starting position.
 */
type Props = { id: string; who: string; paused?: boolean; style?: ViewStyle };

export function ExerciseAnimation(props: Props) {
  // Keyed by id so a new exercise starts its loop from the beginning.
  return <Loop key={`${props.id}-${props.who}`} {...props} />;
}

function Loop({ id, who, paused, style }: Props) {
  const exercise = byId(id);
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const tRef = useRef(0);

  useEffect(() => {
    if (!exercise || paused || reduce) return;
    let raf = 0;
    const start = Date.now() - tRef.current * 1000;
    const tick = () => {
      tRef.current = (Date.now() - start) / 1000;
      setT(tRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [exercise, paused, reduce]);

  if (!exercise) return null;
  const shapes = frameShapes(solve(poseAt(exercise.keys, reduce ? 0 : t)), exercise.props, who);
  return (
    <View style={[{ aspectRatio: VIEWBOX.w / VIEWBOX.h }, style]} accessible accessibilityRole="image" accessibilityLabel={`${exercise.name}, shown by ${castById(who).name}`}>
      <Svg width="100%" height="100%" viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}>
        {shapes.map(draw)}
      </Svg>
    </View>
  );
}

function draw(s: Shape) {
  switch (s.kind) {
    case "line": return <Line key={s.id} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.stroke} strokeWidth={s.width} strokeLinecap="round" />;
    case "circle": return <Circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />;
    case "rect": return <Rect key={s.id} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={s.fill} />;
    case "path": return <Path key={s.id} d={s.d} fill={s.fill} />;
  }
}
