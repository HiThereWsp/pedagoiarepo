export const EDUCATION_LEVELS = {
  kindergarten: [
    { id: 'ps', label: 'Petite Section' },
    { id: 'ms', label: 'Moyenne Section' },
    { id: 'gs', label: 'Grande Section' }
  ],
  primary: [
    { id: 'cp', label: 'CP' },
    { id: 'ce1', label: 'CE1' },
    { id: 'ce2', label: 'CE2' },
    { id: 'cm1', label: 'CM1' },
    { id: 'cm2', label: 'CM2' }
  ],
  secondary: [
    { id: '6e', label: '6ème' },
    { id: '5e', label: '5ème' },
    { id: '4e', label: '4ème' },
    { id: '3e', label: '3ème' }
  ],
  highSchool: [
    { id: '2nd', label: 'Seconde' },
    { id: '1ere', label: 'Première' },
    { id: 'tle', label: 'Terminale' }
  ]
};

export const CLASS_LEVELS = [
  ...EDUCATION_LEVELS.kindergarten,
  ...EDUCATION_LEVELS.primary,
  ...EDUCATION_LEVELS.secondary,
  ...EDUCATION_LEVELS.highSchool
];

interface ClassLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClassLevelSelector({ value, onChange }: ClassLevelSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      <option value="">Sélectionner un niveau</option>
      {CLASS_LEVELS.map((level) => (
        <option key={level.id} value={level.id}>
          {level.label}
        </option>
      ))}
    </select>
  );
}