export function translateSessionName(name?: string | null, lang: 'es' | 'en' = 'es'): string {
  if (!name) return '';
  const trimmed = name.trim();

  if (lang === 'es') {
    const enToEs: Record<string, string> = {
      'Race': 'Carrera',
      'Grand Prix': 'Gran Premio',
      'Feature Race': 'Carrera Principal',
      'Sprint Race': 'Carrera Sprint',
      'Sprint': 'Sprint',
      'Qualifying': 'Clasificación',
      'Sprint Qualifying': 'Clasificación Sprint',
      'Sprint Shootout': 'Clasificación Sprint',
      'Practice 1': 'Práctica 1',
      'Practice 2': 'Práctica 2',
      'Practice 3': 'Práctica 3',
      'Free Practice 1': 'Práctica Libre 1',
      'Free Practice 2': 'Práctica Libre 2',
      'Free Practice 3': 'Práctica Libre 3',
      'Free Practice': 'Práctica Libre',
      'First Practice': 'Práctica 1',
      'Second Practice': 'Práctica 2',
      'Third Practice': 'Práctica 3',
      'Pit Stop': 'Parada en boxes',
    };
    return enToEs[trimmed] || trimmed;
  }

  // lang === 'en'
  const esToEn: Record<string, string> = {
    'Carrera': 'Race',
    'Gran Premio': 'Grand Prix',
    'Carrera Principal': 'Feature Race',
    'Carrera Principal (Feature)': 'Feature Race',
    'Carrera Sprint': 'Sprint Race',
    'Sprint': 'Sprint',
    'Clasificación': 'Qualifying',
    'Clasificacion': 'Qualifying',
    'Clasificación Sprint': 'Sprint Shootout',
    'Clasificacion Sprint': 'Sprint Shootout',
    'Práctica 1': 'Practice 1',
    'Practica 1': 'Practice 1',
    'Práctica 2': 'Practice 2',
    'Practica 2': 'Practice 2',
    'Práctica 3': 'Practice 3',
    'Practica 3': 'Practice 3',
    'Práctica Libre': 'Free Practice',
    'Practica Libre': 'Free Practice',
    'Práctica Libre 1': 'Free Practice 1',
    'Práctica Libre 2': 'Free Practice 2',
    'Práctica Libre 3': 'Free Practice 3',
    'Parada en boxes': 'Pit Stop',
  };
  return esToEn[trimmed] || trimmed;
}
