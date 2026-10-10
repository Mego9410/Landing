"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ExerciseLoop } from "./exercise-loop";

export type CastPerson = { id: string; name: string; age: number; build: string; move: string; ids: string[]; portrait: string };

/** "Pick your person": one big stage showing the chosen cast member's moves, and a button for each of the six. */
export function CastPicker({ people, start = "grace" }: { people: CastPerson[]; start?: string }) {
  const [picked, setPicked] = useState(start);
  const p = people.find((x) => x.id === picked) ?? people[0];
  return (
    <div className={styles.castPick}>
      <figure className={styles.castStageBig}>
        <div className={styles.castStageArt}><ExerciseLoop key={p.id} ids={p.ids} who={p.id} every={6} /></div>
        <figcaption className={styles.castCaption}>
          <strong>{p.name}, {p.age}</strong>
          <span>{p.build}. {p.move}</span>
        </figcaption>
      </figure>
      <div className={styles.castSide}>
        <p className={styles.castEyebrow}>The movement cast</p>
        <h2 id="cast-title" className={styles.castTitle}>Shown by someone like you. Pick who.</h2>
        <div className={styles.castChoices} role="group" aria-label="Who shows you the moves">
          {people.map((x) => (
            <button key={x.id} type="button" className={styles.castChoice} aria-pressed={x.id === picked} onClick={() => setPicked(x.id)}>
              <span className={styles.castPortrait} aria-hidden="true" dangerouslySetInnerHTML={{ __html: x.portrait }} />
              <span>{x.name}, {x.age}</span>
            </button>
          ))}
        </div>
        <p className={styles.castSmall}>Every exercise works with every one of them, at six levels and seated. Or mix it up. Our cast are illustrated characters, not real members.</p>
      </div>
    </div>
  );
}
