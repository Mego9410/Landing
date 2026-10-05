import type * as React from 'react';

type Pastel = 'apricot' | 'sage' | 'lilac' | 'sky' | 'butter';
type IconName = 'today' | 'plan' | 'progress' | 'coach' | 'check' | 'reset';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = apricot (once per screen); secondary = raised white; quiet = text only; danger = rose, destructive only */
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  /** md = 52px (default), sm = 40px */
  size?: 'md' | 'sm';
  /** Full width, for onboarding and the paywall */
  block?: boolean;
  /** Optional leading icon from the built-in set */
  icon?: IconName;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface ChipProps { tone?: 'neutral' | Pastel; selected?: boolean; onClick?: () => void; children?: React.ReactNode; className?: string }
export declare function Chip(props: ChipProps): React.ReactElement;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { tone?: 'raised' | 'sunk' | Pastel; hero?: boolean }
export declare function Card(props: CardProps): React.ReactElement;

export interface HabitCheckProps { label: string; detail?: string; checked?: boolean; onChange?: (checked: boolean) => void; id?: string }
export declare function HabitCheck(props: HabitCheckProps): React.ReactElement;

export interface ScoreRingProps { score: number; size?: number; label?: string }
export declare function ScoreRing(props: ScoreRingProps): React.ReactElement;

export interface HungerScaleProps { value?: 1 | 2 | 3 | 4 | 5; onChange?: (value: number) => void; label?: string; lowLabel?: string; highLabel?: string }
export declare function HungerScale(props: HungerScaleProps): React.ReactElement;

export interface NudgeCardProps { title: string; children?: React.ReactNode; actionLabel?: string; onAction?: () => void }
export declare function NudgeCard(props: NudgeCardProps): React.ReactElement;

export interface CoachBubbleProps { from?: 'coach' | 'you'; redirect?: boolean; children?: React.ReactNode }
export declare function CoachBubble(props: CoachBubbleProps): React.ReactElement;

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; error?: string; suffix?: string }
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface TabBarProps { items?: { key: string; label: string }[]; active?: string; onChange?: (key: string) => void }
export declare function TabBar(props: TabBarProps): React.ReactElement;

declare global { interface Window { Landing: { Button: typeof Button; Chip: typeof Chip; Card: typeof Card; HabitCheck: typeof HabitCheck; ScoreRing: typeof ScoreRing; HungerScale: typeof HungerScale; NudgeCard: typeof NudgeCard; CoachBubble: typeof CoachBubble; TextField: typeof TextField; TabBar: typeof TabBar } } }
