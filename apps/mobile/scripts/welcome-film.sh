#!/usr/bin/env bash
# Cuts the welcome screen's silent loop from the intro film (apps/web/public/film/steadie-intro-v3.mp4).
# Five app-tour moments (Today, dinner, strength, progress, then Steadie itself), each cropped to a 4:5 window around the phone so none of the film's own headlines or chips
# are in shot, crossfaded, and joined back to the first moment so it loops without a jump. No sound.
# Run from the repo root: bash apps/mobile/scripts/welcome-film.sh
set -euo pipefail
SRC=${1:-apps/web/public/film/steadie-intro-v3.mp4}
OUT=${2:-apps/mobile/assets/film/welcome-loop.mp4}
D=0.5   # crossfade, seconds
W=864; H=1080
# start end crop-left   (source seconds and pixels, 1920 x 1080)
SCENES=(
  "18.4 19.9 970"    # Today: one thing next (first, so the still for Reduce Motion is the app's Today screen)
  "26.2 28.4 183"    # Dinner: the recipe plan
  "35.9 37.6 830"    # Strength: sit to stand, with the "same move, less load" note
  "46.2 48.0 980"    # Progress: the steady score
  "14.3 17.1 960"    # Meet Steadie
)
mkdir -p "$(dirname "$OUT")"
args=(); filt=""; n=0
add() { # start end x [label]
  args+=(-ss "$1" -t "$(printf "%.3f" "$(echo "$2 - $1" | bc)")" -i "$SRC")
  filt+="[$n:v]crop=$W:$H:$3:0,scale=720:900:flags=lanczos,fps=30,format=yuv420p,setsar=1,settb=AVTB,setpts=PTS-STARTPTS[c$n];"
  n=$((n + 1))
}
# The first moment starts D in, so the loop ends on the frame it starts on (the last clip is that moment again).
first=(${SCENES[0]}); add "$(echo "${first[0]} + $D" | bc)" "${first[1]}" "${first[2]}"
for s in "${SCENES[@]:1}"; do set -- $s; add "$1" "$2" "$3"; done
add "${first[0]}" "$(echo "${first[0]} + $D + 0.05" | bc)" "${first[2]}"
# Chain the crossfades.
prev="c0"; t=$(echo "${first[1]} - ${first[0]} - $D" | bc); offset=0
for ((i = 1; i < n; i++)); do
  offset=$(printf "%.3f" "$(echo "$offset + $t - $D" | bc)")
  filt+="[$prev][c$i]xfade=transition=fade:duration=$D:offset=$offset[x$i];"; prev="x$i"
  if ((i < n - 1)); then s=(${SCENES[$i]}); t=$(echo "${s[1]} - ${s[0]}" | bc); fi
done
END=$(printf "%.3f" "$(echo "$offset + $D" | bc)")
filt+="[$prev]trim=0:$END,setpts=PTS-STARTPTS[v]"
ffmpeg -hide_banner -loglevel error -y "${args[@]}" -filter_complex "$filt" -map "[v]" -an \
  -c:v libx264 -preset slow -crf 25 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of compact=p=0 "$OUT"
