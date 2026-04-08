export interface WheelAxis {
  id: 'flexibility' | 'strength' | 'balance' | 'breath' | 'mind';
  label: string;
  icon: string;
  summary: string;
  meaning: string;
  exampleStyles: string[];
}

export const wheelAxes: WheelAxis[] = [
  {
    id: 'flexibility',
    label: 'Flexibility',
    icon: '💙',
    summary: 'How much a style opens hips, hamstrings, shoulders, and spine.',
    meaning: 'High flexibility scores usually reflect long holds, deep stretching, and progressive mobility work.',
    exampleStyles: ['Yin Yoga', 'Iyengar', 'Ananda Yoga'],
  },
  {
    id: 'strength',
    label: 'Strength',
    icon: '⚡',
    summary: 'How demanding a style is for the core, shoulders, legs, and full-body control.',
    meaning: 'Higher scores reflect vinyasa, arm balances, sustained holds, and repeated transitions.',
    exampleStyles: ['Ashtanga', 'Power Yoga', 'AcroYoga'],
  },
  {
    id: 'balance',
    label: 'Balance',
    icon: '⚖️',
    summary: 'How much a style trains single-leg stability, proprioception, and control.',
    meaning: 'Balance-heavy styles teach steadiness under pressure and better body awareness.',
    exampleStyles: ['Iyengar', 'AcroYoga', 'Ashtanga'],
  },
  {
    id: 'breath',
    label: 'Breath',
    icon: '🌬️',
    summary: 'How central breathwork and pranayama are to the practice.',
    meaning: 'Styles with high breath scores make breathing the engine of the sequence, not an afterthought.',
    exampleStyles: ['Kundalini', 'Yoga Nidra', 'Jivamukti'],
  },
  {
    id: 'mind',
    label: 'Mind',
    icon: '🧠',
    summary: 'How much the style supports meditation, focus, self-inquiry, and calm.',
    meaning: 'High mind scores typically mean the class includes philosophy, stillness, or reflection.',
    exampleStyles: ['Yoga Nidra', 'Kripalu', 'Jivamukti'],
  },
];
