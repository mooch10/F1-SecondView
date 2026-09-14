export interface RoundRaceSessionConfig {
  time: string;
  finish: string[];
  gaps: string[];
  fastestLap: { code: string; time: string; lap: number };
  dnfs?: Array<{ code: string; status: string; lap: number }>;
  isPending?: boolean;
}

export interface AuthenticRoundConfig {
  circuit: string;
  qualy: string[]; // Order of qualifying: P1 (pole) down to P20+
  feature: RoundRaceSessionConfig;
  sprint: RoundRaceSessionConfig;
}

export const F2_AUTHENTIC_ROUNDS: Record<number, AuthenticRoundConfig> = {
  1: {
    circuit: 'Melbourne',
    qualy: ['BEG', 'STE', 'TSO', 'DUN', 'INT', 'GOE', 'LEO', 'DUR', 'CAM', 'HOE', 'MIN', 'MAI', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'MIY'],
    feature: {
      time: '51:42.894',
      finish: ['TSO', 'CAM', 'HOE', 'DUN', 'BEG', 'STE', 'DUR', 'MIN', 'MAI', 'BEN', 'INT', 'VIL', 'MON', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'LEO', 'GOE'],
      gaps: ['+2.840s', '+5.120s', '+6.430s', '+8.150s', '+10.740s', '+12.300s', '+15.820s', '+18.910s', '+22.100s', '+25.400s', '+28.910s', '+33.200s', '+37.840s', '+42.100s', '+46.850s', '+51.200s', '+1 Lap'],
      dnfs: [
        { code: 'LEO', status: 'Daños por toque', lap: 3 },
        { code: 'GOE', status: 'Suspensión', lap: 8 }
      ],
      fastestLap: { code: 'CAM', time: '1:30.412', lap: 22 }
    },
    sprint: {
      time: '35:28.014',
      finish: ['DUR', 'LEO', 'DUN', 'GOE', 'INT', 'BEG', 'HOE', 'CAM', 'TSO', 'MIN', 'STE', 'MAI', 'BEN', 'VIL', 'MON', 'FIT', 'VAR', 'BOY', 'SHI', 'MIY', 'HER', 'BIL'],
      gaps: ['+1.712s', '+3.205s', '+4.810s', '+6.120s', '+7.450s', '+8.930s', '+10.210s', '+11.840s', '+14.200s', '+16.740s', '+19.300s', '+22.840s', '+26.110s', '+29.700s', '+33.400s', '+38.100s', '+42.900s', '+47.500s', '+52.100s'],
      dnfs: [
        { code: 'HER', status: 'Avería eléctrica', lap: 12 },
        { code: 'BIL', status: 'Colisión T3', lap: 4 }
      ],
      fastestLap: { code: 'DUN', time: '1:31.840', lap: 16 }
    }
  },
  2: {
    circuit: 'Miami',
    qualy: ['MAI', 'CAM', 'STE', 'MIN', 'BEG', 'TSO', 'HOE', 'DUN', 'GOE', 'LEO', 'DUR', 'BEN', 'INT', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'MIY'],
    feature: {
      time: '54:21.306',
      finish: ['MIN', 'BEG', 'CAM', 'MAI', 'STE', 'TSO', 'DUN', 'DUR', 'HOE', 'GOE', 'LEO', 'BEN', 'INT', 'VIL', 'BIL', 'FIT', 'VAR', 'BOY', 'MON', 'HER'],
      gaps: ['+0.612s', '+1.240s', '+3.890s', '+6.120s', '+8.450s', '+11.300s', '+14.820s', '+18.150s', '+21.400s', '+25.610s', '+29.840s', '+34.120s', '+39.400s', '+44.750s', '+50.200s', '+56.410s', '+1 Lap'],
      dnfs: [
        { code: 'MON', status: 'Colisión T8', lap: 19 },
        { code: 'HER', status: 'Caja de cambios', lap: 7 }
      ],
      fastestLap: { code: 'BEG', time: '1:40.812', lap: 28 }
    },
    sprint: {
      time: '34:10.518',
      finish: ['TSO', 'HOE', 'DUN', 'LEO', 'BEG', 'MAI', 'MIN', 'CAM', 'STE', 'DUR', 'GOE', 'BEN', 'INT', 'VIL', 'MON', 'FIT', 'BOY', 'SHI', 'BIL', 'VAR'],
      gaps: ['+0.412s', '+0.890s', '+2.150s', '+3.840s', '+5.210s', '+6.730s', '+8.110s', '+10.450s', '+11.900s', '+14.300s', '+17.820s', '+21.400s', '+25.110s', '+29.600s', '+34.200s', '+39.100s', '+44.800s'],
      dnfs: [
        { code: 'BIL', status: 'Fallo de freno', lap: 14 },
        { code: 'VAR', status: 'Trompo T11', lap: 9 }
      ],
      fastestLap: { code: 'HOE', time: '1:41.920', lap: 12 }
    }
  },
  3: {
    circuit: 'Montreal',
    qualy: ['HOE', 'TSO', 'STE', 'DUN', 'MIN', 'LEO', 'VIL', 'BEN', 'CAM', 'DUR', 'MAI', 'BEG', 'GOE', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '48:15.620',
      finish: ['STE', 'DUN', 'VIL', 'HOE', 'TSO', 'CAM', 'MIN', 'LEO', 'BEG', 'BEN', 'DUR', 'MAI', 'GOE', 'MON', 'HER', 'BIL', 'VAR', 'BOY', 'INT', 'FIT'],
      gaps: ['+1.412s', '+4.820s', '+6.730s', '+8.120s', '+10.450s', '+13.200s', '+15.840s', '+19.110s', '+23.400s', '+27.810s', '+32.400s', '+37.100s', '+42.500s', '+48.200s', '+54.300s', '+59.800s', '+1 Lap'],
      dnfs: [
        { code: 'INT', status: 'Pinchazo/muro T4', lap: 21 },
        { code: 'FIT', status: 'Fallo de frenos', lap: 11 }
      ],
      fastestLap: { code: 'DUN', time: '1:19.410', lap: 26 }
    },
    sprint: {
      time: '33:45.912',
      finish: ['LEO', 'MIN', 'STE', 'DUN', 'DUR', 'CAM', 'TSO', 'HOE', 'BEG', 'MAI', 'VIL', 'BEN', 'MON', 'HER', 'FIT', 'VAR', 'BOY', 'SHI', 'GOE', 'MIY'],
      gaps: ['+1.140s', '+2.830s', '+4.510s', '+5.920s', '+7.110s', '+8.450s', '+10.200s', '+12.840s', '+15.100s', '+18.400s', '+22.100s', '+26.300s', '+30.800s', '+35.400s', '+40.200s', '+45.900s', '+51.300s'],
      dnfs: [
        { code: 'GOE', status: 'Daños de alerón', lap: 16 },
        { code: 'MIY', status: 'Presión hidráulica', lap: 8 }
      ],
      fastestLap: { code: 'LEO', time: '1:20.105', lap: 18 }
    }
  },
  4: {
    circuit: 'Monaco',
    qualy: ['CAM', 'DUN', 'TSO', 'BEG', 'MAI', 'MIN', 'LEO', 'DUR', 'STE', 'HOE', 'GOE', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '1:01:44.218',
      finish: ['TSO', 'DUN', 'BEG', 'MAI', 'CAM', 'MIN', 'LEO', 'DUR', 'STE', 'GOE', 'HOE', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'BOY', 'SHI', 'BEN', 'VAR'],
      gaps: ['+1.890s', '+3.420s', '+4.120s', '+7.850s', '+9.400s', '+12.110s', '+15.340s', '+19.820s', '+24.100s', '+28.450s', '+33.200s', '+38.700s', '+44.200s', '+50.800s', '+57.300s', '+1:04.100', '+1 Lap'],
      dnfs: [
        { code: 'BEN', status: 'Colisión Mirabeau', lap: 25 },
        { code: 'VAR', status: 'Presión de aceite', lap: 18 }
      ],
      fastestLap: { code: 'DUN', time: '1:21.840', lap: 31 }
    },
    sprint: {
      time: '41:52.314',
      finish: ['LEO', 'MIN', 'MAI', 'BEG', 'DUN', 'TSO', 'CAM', 'STE', 'DUR', 'HOE', 'GOE', 'BEN', 'VIL', 'HER', 'FIT', 'BOY', 'SHI', 'INT', 'MON', 'BIL'],
      gaps: ['+2.415s', '+3.890s', '+5.120s', '+6.450s', '+7.820s', '+9.110s', '+10.950s', '+13.200s', '+15.400s', '+18.900s', '+22.400s', '+26.100s', '+31.400s', '+36.800s', '+42.100s', '+48.000s', '+54.300s'],
      dnfs: [
        { code: 'MON', status: 'Toque Sainte Dévote', lap: 14 },
        { code: 'BIL', status: 'Barrera Rascasse', lap: 6 }
      ],
      fastestLap: { code: 'MIN', time: '1:22.910', lap: 20 }
    }
  },
  5: {
    circuit: 'Barcelona',
    qualy: ['CAM', 'DUR', 'MAI', 'MIN', 'TSO', 'DUN', 'LEO', 'BEG', 'STE', 'HOE', 'GOE', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '53:18.940',
      finish: ['CAM', 'TSO', 'DUN', 'MIN', 'DUR', 'MAI', 'LEO', 'BEG', 'STE', 'HOE', 'BEN', 'GOE', 'VIL', 'HER', 'BIL', 'VAR', 'BOY', 'SHI', 'MON', 'FIT'],
      gaps: ['+3.450s', '+6.120s', '+8.740s', '+11.200s', '+13.850s', '+16.410s', '+19.820s', '+23.150s', '+27.400s', '+31.800s', '+36.200s', '+41.500s', '+47.100s', '+53.400s', '+59.800s', '+1:06.200', '+1 Lap'],
      dnfs: [
        { code: 'MON', status: 'Salida de pista T4', lap: 22 },
        { code: 'FIT', status: 'Problema de frenos', lap: 10 }
      ],
      fastestLap: { code: 'TSO', time: '1:26.115', lap: 24 }
    },
    sprint: {
      time: '35:12.740',
      finish: ['MAI', 'MIN', 'TSO', 'LEO', 'CAM', 'DUR', 'DUN', 'STE', 'BEG', 'HOE', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'VAR', 'BOY', 'SHI', 'GOE', 'MIY'],
      gaps: ['+1.840s', '+3.120s', '+5.410s', '+7.200s', '+8.930s', '+10.820s', '+12.450s', '+14.110s', '+16.900s', '+20.100s', '+23.800s', '+28.100s', '+32.900s', '+37.400s', '+42.800s', '+48.500s', '+54.200s'],
      dnfs: [
        { code: 'GOE', status: 'Fallo de motor', lap: 15 },
        { code: 'MIY', status: 'Toque curva 1', lap: 3 }
      ],
      fastestLap: { code: 'MAI', time: '1:27.420', lap: 14 }
    }
  },
  6: {
    circuit: 'Spielberg',
    qualy: ['LEO', 'MIN', 'GOE', 'TSO', 'CAM', 'BEN', 'MON', 'DUN', 'DUR', 'STE', 'BEG', 'MAI', 'HOE', 'VIL', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '45:32.180',
      finish: ['TSO', 'MIN', 'GOE', 'LEO', 'CAM', 'DUR', 'DUN', 'BEG', 'MAI', 'BEN', 'MON', 'HOE', 'VIL', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'STE', 'HER'],
      gaps: ['+2.840s', '+4.510s', '+6.120s', '+8.740s', '+11.450s', '+13.910s', '+16.730s', '+19.840s', '+23.120s', '+27.400s', '+31.900s', '+36.800s', '+42.100s', '+47.900s', '+53.800s', '+1:00.200', '+1 Lap'],
      dnfs: [
        { code: 'STE', status: 'Penalización/Retirada', lap: 28 },
        { code: 'HER', status: 'Avería caja', lap: 14 }
      ],
      fastestLap: { code: 'MIN', time: '1:17.205', lap: 25 }
    },
    sprint: {
      time: '31:08.412',
      finish: ['BEN', 'MON', 'VIL', 'TSO', 'MIN', 'LEO', 'DUN', 'DUR', 'BEG', 'MAI', 'GOE', 'HOE', 'STE', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'CAM', 'INT'],
      gaps: ['+0.412s', '+1.890s', '+3.210s', '+4.620s', '+5.950s', '+7.410s', '+9.120s', '+11.340s', '+13.800s', '+16.700s', '+20.100s', '+24.300s', '+28.900s', '+33.800s', '+38.900s', '+44.200s', '+50.100s'],
      dnfs: [
        { code: 'CAM', status: 'Trompo T3 tras toque', lap: 1 },
        { code: 'INT', status: 'Daños alerón', lap: 1 }
      ],
      fastestLap: { code: 'BEN', time: '1:18.112', lap: 19 }
    }
  },
  7: {
    circuit: 'Silverstone',
    qualy: ['CAM', 'DUN', 'TSO', 'MIN', 'VIL', 'MAI', 'LEO', 'DUR', 'BEG', 'STE', 'HOE', 'GOE', 'BEN', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '50:49.732',
      finish: ['TSO', 'VIL', 'MAI', 'CAM', 'DUN', 'MIN', 'LEO', 'DUR', 'BEG', 'GOE', 'STE', 'HOE', 'HER', 'FIT', 'VAR', 'BOY', 'SHI', 'MIY', 'BEN', 'MON'],
      gaps: ['+3.210s', '+5.845s', '+7.410s', '+9.820s', '+12.450s', '+15.110s', '+18.340s', '+21.900s', '+25.700s', '+29.800s', '+34.500s', '+39.700s', '+45.100s', '+51.300s', '+57.800s', '+1:04.200', '+1 Lap'],
      dnfs: [
        { code: 'BEN', status: 'Pinchazo/muro Abbey', lap: 24 },
        { code: 'MON', status: 'Colisión Club', lap: 12 }
      ],
      fastestLap: { code: 'VIL', time: '1:41.210', lap: 26 }
    },
    sprint: {
      time: '34:49.210',
      finish: ['TSO', 'MIN', 'VIL', 'DUN', 'MAI', 'LEO', 'CAM', 'DUR', 'BEG', 'STE', 'HOE', 'GOE', 'BEN', 'MON', 'HER', 'FIT', 'VAR', 'BOY', 'BIL', 'MIY'],
      gaps: ['+0.540s', '+2.150s', '+3.840s', '+5.410s', '+7.120s', '+8.930s', '+10.640s', '+12.810s', '+15.200s', '+18.400s', '+22.100s', '+26.300s', '+31.000s', '+36.200s', '+41.800s', '+47.900s', '+54.200s'],
      dnfs: [
        { code: 'BIL', status: 'Suspensión rota', lap: 16 },
        { code: 'MIY', status: 'Fallo eléctrico', lap: 7 }
      ],
      fastestLap: { code: 'TSO', time: '1:42.105', lap: 18 }
    }
  },
  8: {
    circuit: 'Spa-Francorchamps',
    qualy: ['CAM', 'INT', 'TSO', 'STE', 'DUR', 'MIN', 'DUN', 'BEG', 'LEO', 'MAI', 'HOE', 'GOE', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'MIY'],
    feature: {
      time: '52:27.410',
      finish: ['CAM', 'INT', 'TSO', 'DUR', 'MIN', 'DUN', 'LEO', 'STE', 'BEG', 'MAI', 'HOE', 'BEN', 'VIL', 'MON', 'HER', 'VAR', 'BOY', 'SHI', 'BIL', 'FIT'],
      gaps: ['+2.412s', '+4.890s', '+7.120s', '+9.840s', '+12.300s', '+15.410s', '+18.920s', '+22.450s', '+26.100s', '+30.400s', '+35.100s', '+40.800s', '+46.900s', '+53.400s', '+1:00.200', '+1:07.800', '+1 Lap'],
      dnfs: [
        { code: 'BIL', status: 'Colisión Les Combes', lap: 19 },
        { code: 'FIT', status: 'Fallo hidráulico', lap: 9 }
      ],
      fastestLap: { code: 'MIN', time: '1:57.112', lap: 21 }
    },
    sprint: {
      time: '36:12.805',
      finish: ['DUR', 'STE', 'DUN', 'MIN', 'TSO', 'LEO', 'CAM', 'BEG', 'MAI', 'HOE', 'INT', 'BEN', 'VIL', 'MON', 'HER', 'BIL', 'FIT', 'BOY', 'GOE', 'VAR'],
      gaps: ['+0.312s', '+2.140s', '+3.890s', '+5.420s', '+7.110s', '+8.930s', '+11.200s', '+13.450s', '+16.120s', '+19.400s', '+23.100s', '+27.400s', '+32.100s', '+37.500s', '+43.200s', '+49.800s', '+56.400s'],
      dnfs: [
        { code: 'GOE', status: 'Salida en Pouhon', lap: 11 },
        { code: 'VAR', status: 'Avería mecánica', lap: 5 }
      ],
      fastestLap: { code: 'STE', time: '1:58.204', lap: 15 }
    }
  },
  9: {
    circuit: 'Budapest',
    qualy: ['MAI', 'CAM', 'LEO', 'MIN', 'BEG', 'HOE', 'DUR', 'TSO', 'MON', 'DUN', 'STE', 'GOE', 'BEN', 'VIL', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'MIY'],
    feature: {
      time: '56:04.530',
      finish: ['LEO', 'MAI', 'CAM', 'BEG', 'DUN', 'MIN', 'HOE', 'DUR', 'STE', 'GOE', 'BEN', 'VIL', 'MON', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'TSO', 'HER'],
      gaps: ['+0.912s', '+2.140s', '+5.890s', '+8.450s', '+11.210s', '+14.300s', '+17.840s', '+21.400s', '+25.100s', '+29.400s', '+34.200s', '+39.800s', '+45.600s', '+51.900s', '+58.400s', '+1:05.100', '+1 Lap'],
      dnfs: [
        { code: 'TSO', status: 'Avería de turbo', lap: 24 },
        { code: 'HER', status: 'Suspensión curva 4', lap: 15 }
      ],
      fastestLap: { code: 'LEO', time: '1:29.110', lap: 28 }
    },
    sprint: {
      time: '37:24.618',
      finish: ['MIN', 'BEG', 'HOE', 'LEO', 'MAI', 'CAM', 'DUN', 'STE', 'DUR', 'GOE', 'BEN', 'VIL', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'MON', 'TSO'],
      gaps: ['+1.840s', '+3.120s', '+5.410s', '+7.200s', '+9.110s', '+11.450s', '+13.820s', '+15.900s', '+18.400s', '+21.800s', '+25.900s', '+30.400s', '+35.800s', '+41.500s', '+47.800s', '+54.300s', '+1:01.200'],
      dnfs: [
        { code: 'MON', status: 'Colisión curva 1', lap: 1 },
        { code: 'TSO', status: 'Colisión curva 1', lap: 1 }
      ],
      fastestLap: { code: 'MIN', time: '1:29.840', lap: 17 }
    }
  },
  10: {
    circuit: 'Monza',
    qualy: ['CAM', 'DUR', 'DUN', 'INT', 'LEO', 'STE', 'TSO', 'BEN', 'GOE', 'VAR', 'MIY', 'HOE', 'BEG', 'MIN', 'MAI', 'MON', 'HER', 'BIL', 'FIT', 'BOY', 'SHI', 'VIL'],
    feature: {
      time: '49:18.428',
      finish: ['DUR', 'CAM', 'LEO', 'BEN', 'MIY', 'DUN', 'TSO', 'INT', 'GOE', 'VAR', 'STE', 'HOE', 'BEG', 'MIN', 'MAI', 'VIL', 'MON', 'FIT', 'HER', 'BIL'],
      gaps: ['+0.312s', '+1.890s', '+3.215s', '+4.108s', '+4.892s', '+5.410s', '+7.820s', '+9.114s', '+11.450s', '+14.200s', '+17.800s', '+21.400s', '+25.800s', '+30.400s', '+35.900s', '+41.800s', '+48.200s'],
      dnfs: [
        { code: 'HER', status: 'Salida grava Parabolica', lap: 14 },
        { code: 'BIL', status: 'Sobrecalentamiento', lap: 22 }
      ],
      fastestLap: { code: 'CAM', time: '1:32.410', lap: 24 }
    },
    sprint: {
      time: '32:41.802',
      finish: ['DUR', 'BEN', 'GOE', 'LEO', 'TSO', 'STE', 'DUN', 'HOE', 'BEG', 'MIY', 'INT', 'MIN', 'MAI', 'MON', 'FIT', 'BOY', 'SHI', 'VIL', 'CAM', 'VAR'],
      gaps: ['+1.214s', '+2.450s', '+3.890s', '+4.912s', '+6.120s', '+7.450s', '+8.930s', '+11.200s', '+13.840s', '+16.900s', '+20.400s', '+24.500s', '+29.100s', '+34.200s', '+39.800s', '+45.700s', '+52.100s'],
      dnfs: [
        { code: 'CAM', status: 'Trompo tras toque', lap: 5 },
        { code: 'VAR', status: 'Daños de dirección', lap: 5 }
      ],
      fastestLap: { code: 'DUR', time: '1:33.105', lap: 18 }
    }
  },
  11: {
    circuit: 'Madrid',
    qualy: ['BEG', 'DUN', 'CAM', 'STE', 'TSO', 'BIL', 'HOE', 'LEO', 'MIY', 'FIT', 'DUR', 'MIN', 'MAI', 'GOE', 'MON', 'BOY', 'INT', 'VIL', 'SHI', 'BEN', 'VAR', 'HER'],
    feature: {
      time: '53:14.892',
      finish: ['BEG', 'DUN', 'CAM', 'STE', 'TSO', 'BIL', 'HOE', 'LEO', 'MIY', 'FIT', 'DUR', 'MIN', 'MAI', 'GOE', 'MON', 'BOY', 'INT', 'VIL', 'SHI', 'BEN', 'VAR', 'HER'],
      gaps: ['+1.412s', '+3.890s', '+5.620s', '+7.110s', '+9.840s', '+12.450s', '+15.100s', '+18.420s', '+22.100s', '+26.800s', '+31.400s', '+36.200s', '+41.900s', '+47.800s', '+54.100s', '+1:01.200', '+1:08.400', '+1 Lap', '+1 Lap'],
      dnfs: [
        { code: 'VAR', status: 'Fallo de motor', lap: 22 },
        { code: 'HER', status: 'Rotura de suspensión', lap: 15 }
      ],
      fastestLap: { code: 'BEG', time: '1:44.331', lap: 26 }
    },
    sprint: {
      time: '36:48.112',
      finish: ['MIY', 'FIT', 'HOE', 'LEO', 'STE', 'CAM', 'DUN', 'BOY', 'BEG', 'BIL', 'DUR', 'MIN', 'MAI', 'GOE', 'MON', 'INT', 'VIL', 'SHI', 'TSO', 'BEN'],
      gaps: ['+2.614s', '+2.981s', '+6.120s', '+7.450s', '+8.210s', '+8.930s', '+10.150s', '+12.410s', '+15.820s', '+18.900s', '+22.400s', '+26.100s', '+30.800s', '+35.400s', '+40.900s', '+46.800s', '+53.200s'],
      dnfs: [
        { code: 'TSO', status: 'Barrera curva 20', lap: 16 },
        { code: 'BEN', status: 'Colisión C1 con Montoya', lap: 1 }
      ],
      fastestLap: { code: 'HOE', time: '1:45.890', lap: 18 }
    }
  },
  12: {
    circuit: 'Baku',
    qualy: ['CAM', 'TSO', 'MIN', 'DUN', 'DUR', 'LEO', 'BEG', 'MAI', 'HOE', 'STE', 'BEN', 'GOE', 'MON', 'MIY', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI', 'INT', 'VIL'],
    feature: {
      isPending: true,
      time: 'Por disputarse',
      finish: ['CAM', 'TSO', 'MIN', 'DUN', 'DUR', 'LEO', 'BEG', 'MAI', 'HOE', 'STE', 'BEN', 'GOE', 'MON', 'MIY', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI'],
      gaps: [],
      dnfs: [],
      fastestLap: { code: 'CAM', time: '1:52.410', lap: 0 }
    },
    sprint: {
      isPending: true,
      time: 'Por disputarse',
      finish: ['STE', 'HOE', 'MAI', 'BEG', 'LEO', 'DUR', 'DUN', 'MIN', 'TSO', 'CAM', 'BEN', 'GOE', 'MON', 'MIY', 'HER', 'BIL', 'FIT', 'VAR', 'BOY', 'SHI'],
      gaps: [],
      dnfs: [],
      fastestLap: { code: 'STE', time: '1:53.110', lap: 0 }
    }
  }
};

export const F3_AUTHENTIC_ROUNDS: Record<number, AuthenticRoundConfig> = {
  1: {
    circuit: 'Melbourne',
    qualy: ['NAE', 'UGO', 'KAT', 'SLA', 'RIV', 'YAM', 'BAD', 'TAP', 'STR', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '38:45.120',
      finish: ['UGO', 'SLA', 'KAT', 'RIV', 'YAM', 'BAD', 'TAP', 'STR', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'NAE', 'GIU'],
      gaps: ['+1.450s', '+3.890s', '+5.610s', '+7.820s', '+10.450s', '+13.200s', '+16.890s', '+20.450s', '+24.120s', '+28.400s', '+32.800s', '+37.400s', '+42.100s', '+48.500s', '+54.200s', '+1:00.400', '+1 Lap'],
      dnfs: [
        { code: 'NAE', status: 'Penalización 10s', lap: 22 },
        { code: 'GIU', status: 'Avería mecánica', lap: 14 }
      ],
      fastestLap: { code: 'UGO', time: '1:34.210', lap: 19 }
    },
    sprint: {
      time: '26:14.305',
      finish: ['PIN', 'DEL', 'KAT', 'UGO', 'SLA', 'RIV', 'YAM', 'BAD', 'TAP', 'STR', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'LAC', 'LE', 'GIU', 'WHA', 'NAE'],
      gaps: ['+0.412s', '+1.890s', '+3.120s', '+4.210s', '+5.840s', '+7.450s', '+9.210s', '+11.450s', '+13.800s', '+16.900s', '+20.400s', '+24.800s', '+29.400s', '+34.800s', '+40.200s', '+46.500s', '+53.100s'],
      dnfs: [
        { code: 'WHA', status: 'Colisión curva 1', lap: 8 },
        { code: 'NAE', status: 'Daños por toque', lap: 8 }
      ],
      fastestLap: { code: 'PIN', time: '1:35.104', lap: 12 }
    }
  },
  2: {
    circuit: 'Monaco',
    qualy: ['NAE', 'BAD', 'SLA', 'UGO', 'TAP', 'YAM', 'RIV', 'PIN', 'STR', 'KAT', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '39:24.610',
      finish: ['BAD', 'NAE', 'SLA', 'UGO', 'TAP', 'YAM', 'RIV', 'PIN', 'STR', 'KAT', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+1.102s', '+2.450s', '+4.120s', '+6.890s', '+9.450s', '+12.100s', '+15.800s', '+19.400s', '+23.100s', '+27.800s', '+32.400s', '+37.900s', '+43.500s', '+49.800s', '+56.400s', '+1:03.200', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Toque Mirabeau', lap: 18 },
        { code: 'GIU', status: 'Presión de combustible', lap: 11 }
      ],
      fastestLap: { code: 'BAD', time: '1:24.810', lap: 21 }
    },
    sprint: {
      time: '32:10.840',
      finish: ['YAM', 'PIN', 'BAD', 'SLA', 'NAE', 'UGO', 'TAP', 'RIV', 'STR', 'KAT', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+0.915s', '+1.840s', '+2.910s', '+4.120s', '+5.840s', '+7.450s', '+9.210s', '+11.800s', '+14.500s', '+17.900s', '+21.800s', '+26.400s', '+31.200s', '+36.800s', '+42.500s', '+48.900s', '+55.400s'],
      dnfs: [
        { code: 'LE', status: 'Barrera Rascasse', lap: 12 },
        { code: 'GIU', status: 'Alerón roto', lap: 6 }
      ],
      fastestLap: { code: 'YAM', time: '1:25.412', lap: 14 }
    }
  },
  3: {
    circuit: 'Barcelona',
    qualy: ['NAE', 'UGO', 'YAM', 'SLA', 'BAD', 'TAP', 'RIV', 'STR', 'WHA', 'KAT', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '37:18.950',
      finish: ['NAE', 'YAM', 'UGO', 'SLA', 'STR', 'BAD', 'RIV', 'TAP', 'KAT', 'PIN', 'WHA', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+2.410s', '+4.120s', '+6.840s', '+9.210s', '+11.890s', '+14.650s', '+17.900s', '+21.400s', '+25.100s', '+29.400s', '+34.200s', '+39.100s', '+44.800s', '+50.900s', '+57.400s', '+1:04.200', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Salida de pista T3', lap: 17 },
        { code: 'GIU', status: 'Sobrecalentamiento', lap: 9 }
      ],
      fastestLap: { code: 'NAE', time: '1:29.840', lap: 18 }
    },
    sprint: {
      time: '27:32.410',
      finish: ['WHA', 'SLA', 'NAE', 'UGO', 'YAM', 'BAD', 'RIV', 'STR', 'TAP', 'KAT', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+1.215s', '+2.840s', '+4.110s', '+5.890s', '+7.450s', '+9.120s', '+11.450s', '+13.900s', '+16.800s', '+20.100s', '+24.100s', '+28.900s', '+33.800s', '+39.200s', '+45.100s', '+51.400s', '+58.200s'],
      dnfs: [
        { code: 'LE', status: 'Colisión curva 1', lap: 1 },
        { code: 'GIU', status: 'Fallo hidráulico', lap: 1 }
      ],
      fastestLap: { code: 'WHA', time: '1:30.912', lap: 15 }
    }
  },
  4: {
    circuit: 'Spielberg',
    qualy: ['YAM', 'UGO', 'STR', 'RIV', 'WHA', 'SLA', 'KAT', 'BAD', 'NAE', 'TAP', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '36:05.420',
      finish: ['STR', 'UGO', 'YAM', 'SLA', 'RIV', 'KAT', 'BAD', 'NAE', 'TAP', 'PIN', 'WHA', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+1.840s', '+3.410s', '+5.120s', '+7.890s', '+10.450s', '+13.200s', '+16.110s', '+19.450s', '+23.100s', '+27.400s', '+32.100s', '+37.200s', '+42.800s', '+48.900s', '+55.400s', '+1:02.100', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Daños por piano T9', lap: 19 },
        { code: 'GIU', status: 'Fallo de motor', lap: 11 }
      ],
      fastestLap: { code: 'STR', time: '1:21.840', lap: 21 }
    },
    sprint: {
      time: '25:40.112',
      finish: ['RIV', 'WHA', 'SLA', 'UGO', 'KAT', 'YAM', 'STR', 'BAD', 'NAE', 'TAP', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+0.812s', '+2.140s', '+3.890s', '+5.210s', '+6.840s', '+8.910s', '+11.200s', '+13.840s', '+16.700s', '+20.100s', '+24.300s', '+28.900s', '+34.100s', '+39.800s', '+45.900s', '+52.400s', '+59.100s'],
      dnfs: [
        { code: 'LE', status: 'Trompo T3', lap: 12 },
        { code: 'GIU', status: 'Presión de aceite', lap: 5 }
      ],
      fastestLap: { code: 'RIV', time: '1:22.450', lap: 14 }
    }
  },
  5: {
    circuit: 'Silverstone',
    qualy: ['SLA', 'UGO', 'RIV', 'GLA', 'NAE', 'BAD', 'KAT', 'TAP', 'STR', 'YAM', 'PIN', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '38:52.180',
      finish: ['SLA', 'RIV', 'GLA', 'UGO', 'BAD', 'KAT', 'TAP', 'STR', 'YAM', 'PIN', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU', 'NAE'],
      gaps: ['+1.412s', '+3.890s', '+5.120s', '+7.450s', '+10.100s', '+13.400s', '+16.900s', '+20.800s', '+25.100s', '+29.800s', '+35.100s', '+40.900s', '+47.200s', '+53.800s', '+1:01.200', '+1:09.100', '+1 Lap'],
      dnfs: [
        { code: 'GIU', status: 'Suspensión rota', lap: 16 },
        { code: 'NAE', status: 'Descalificado', lap: 20 }
      ],
      fastestLap: { code: 'SLA', time: '1:44.210', lap: 18 }
    },
    sprint: {
      time: '28:14.620',
      finish: ['UGO', 'DAV', 'NAE', 'SLA', 'RIV', 'GLA', 'BAD', 'KAT', 'TAP', 'STR', 'YAM', 'PIN', 'CLE', 'COL', 'NAK', 'WHA', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+17.210s', '+18.450s', '+21.400s', '+24.100s', '+27.400s', '+31.200s', '+35.800s', '+40.900s', '+46.400s', '+52.100s', '+58.400s', '+1:05.100', '+1:12.400', '+1:20.100', '+1 Lap', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Colisión Copse', lap: 9 },
        { code: 'GIU', status: 'Daños fondo plano', lap: 4 }
      ],
      fastestLap: { code: 'UGO', time: '1:45.108', lap: 14 }
    }
  },
  6: {
    circuit: 'Spa-Francorchamps',
    qualy: ['SLA', 'UGO', 'RIV', 'NAE', 'TAP', 'KAT', 'BAD', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '39:12.740',
      finish: ['RIV', 'SLA', 'UGO', 'NAE', 'TAP', 'KAT', 'BAD', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+2.140s', '+3.890s', '+6.210s', '+8.740s', '+11.890s', '+15.400s', '+19.200s', '+23.400s', '+28.100s', '+33.400s', '+39.100s', '+45.200s', '+51.800s', '+58.900s', '+1:06.400', '+1:14.200', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Salida en Pouhon', lap: 11 },
        { code: 'GIU', status: 'Avería eléctrica', lap: 7 }
      ],
      fastestLap: { code: 'RIV', time: '2:05.412', lap: 14 }
    },
    sprint: {
      time: '29:48.310',
      finish: ['NAK', 'TAP', 'RIV', 'BAD', 'KAT', 'NAE', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU', 'UGO', 'SLA'],
      gaps: ['+1.420s', '+2.890s', '+4.510s', '+6.120s', '+8.450s', '+10.900s', '+13.800s', '+17.100s', '+21.400s', '+26.100s', '+31.400s', '+37.200s', '+43.800s', '+50.900s', '+58.400s', '+1:06.200'],
      dnfs: [
        { code: 'UGO', status: 'Colisión Les Combes', lap: 5 },
        { code: 'SLA', status: 'Colisión Les Combes', lap: 5 }
      ],
      fastestLap: { code: 'NAK', time: '2:06.840', lap: 10 }
    }
  },
  7: {
    circuit: 'Budapest',
    qualy: ['TAP', 'SLA', 'UGO', 'NAE', 'RIV', 'KAT', 'BAD', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
    feature: {
      time: '37:44.218',
      finish: ['SLA', 'UGO', 'TAP', 'NAE', 'RIV', 'KAT', 'BAD', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+0.612s', '+2.410s', '+5.120s', '+7.840s', '+10.900s', '+14.200s', '+17.900s', '+22.100s', '+26.800s', '+32.100s', '+37.900s', '+44.200s', '+51.100s', '+58.400s', '+1:06.200', '+1:14.800', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Colisión T1', lap: 16 },
        { code: 'GIU', status: 'Fallo de frenos', lap: 10 }
      ],
      fastestLap: { code: 'SLA', time: '1:32.410', lap: 19 }
    },
    sprint: {
      time: '28:34.910',
      finish: ['NAE', 'SLA', 'UGO', 'TAP', 'KAT', 'RIV', 'BAD', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LAC', 'LE', 'GIU'],
      gaps: ['+1.840s', '+3.120s', '+4.890s', '+6.410s', '+8.210s', '+10.450s', '+13.100s', '+16.200s', '+19.800s', '+24.100s', '+28.900s', '+34.200s', '+40.100s', '+46.800s', '+54.100s', '+1:02.400'],
      dnfs: [
        { code: 'LE', status: 'Trompo curva 2', lap: 8 },
        { code: 'GIU', status: 'Avería caja', lap: 3 }
      ],
      fastestLap: { code: 'NAE', time: '1:33.205', lap: 12 }
    }
  },
  8: {
    circuit: 'Monza',
    qualy: ['SLA', 'LAC', 'RIV', 'BAD', 'KAT', 'UGO', 'NAE', 'TAP', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LE', 'GIU'],
    feature: {
      time: '36:45.310',
      finish: ['LAC', 'SLA', 'RIV', 'UGO', 'KAT', 'BAD', 'NAE', 'TAP', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LE', 'GIU'],
      gaps: ['+0.840s', '+2.150s', '+3.890s', '+5.410s', '+7.120s', '+9.450s', '+12.100s', '+15.200s', '+18.900s', '+23.100s', '+27.800s', '+33.100s', '+38.900s', '+45.200s', '+52.100s', '+59.800s', '+1 Lap'],
      dnfs: [
        { code: 'LE', status: 'Colisión Variante del Rettifilo', lap: 14 },
        { code: 'GIU', status: 'Rotura de suspensión', lap: 7 }
      ],
      fastestLap: { code: 'LAC', time: '1:37.410', lap: 18 }
    },
    sprint: {
      time: '26:52.410',
      finish: ['KAT', 'SLA', 'BAD', 'LAC', 'RIV', 'UGO', 'NAE', 'TAP', 'STR', 'YAM', 'PIN', 'GLA', 'CLE', 'COL', 'NAK', 'WHA', 'DAV', 'DEL', 'LE', 'GIU'],
      gaps: ['+1.102s', '+2.410s', '+3.890s', '+5.210s', '+6.840s', '+8.910s', '+11.200s', '+13.900s', '+17.100s', '+20.900s', '+25.200s', '+30.100s', '+35.800s', '+42.100s', '+49.100s', '+56.800s'],
      dnfs: [
        { code: 'LE', status: 'Toque con Deligny', lap: 11 },
        { code: 'GIU', status: 'Fallo motor', lap: 4 }
      ],
      fastestLap: { code: 'KAT', time: '1:38.205', lap: 12 }
    }
  },
  9: {
    circuit: 'Madrid',
    qualy: ['KAT', 'CLE', 'TAP', 'UGO', 'NAK', 'GIU', 'POW', 'RIV', 'NAE', 'WHA', 'DEL', 'PIN', 'SLA', 'YAM', 'STR', 'GLA', 'COL', 'DAV', 'LAC', 'LE'],
    feature: {
      time: '38:12.640',
      finish: ['CLE', 'KAT', 'TAP', 'UGO', 'NAK', 'GIU', 'POW', 'RIV', 'NAE', 'WHA', 'DEL', 'PIN', 'YAM', 'STR', 'COL', 'DAV', 'LAC', 'LE', 'SLA', 'GLA'],
      gaps: ['+1.210s', '+2.890s', '+4.450s', '+6.120s', '+7.840s', '+9.410s', '+11.200s', '+13.850s', '+16.410s', '+19.800s', '+23.400s', '+27.800s', '+32.900s', '+38.400s', '+44.800s', '+51.900s', '+59.400s'],
      dnfs: [
        { code: 'SLA', status: 'Accidente curva 19', lap: 10 },
        { code: 'GLA', status: 'Colisión múltiple T8', lap: 1 }
      ],
      fastestLap: { code: 'TAP', time: '1:46.812', lap: 16 }
    },
    sprint: {
      time: '27:18.420',
      finish: ['NAE', 'WHA', 'POW', 'PIN', 'GIU', 'RIV', 'NAK', 'UGO', 'KAT', 'TAP', 'CLE', 'SLA', 'YAM', 'STR', 'COL', 'DAV', 'DEL', 'LAC', 'LE', 'GLA'],
      gaps: ['+1.340s', '+2.890s', '+4.120s', '+5.610s', '+7.110s', '+8.840s', '+10.200s', '+12.450s', '+14.100s', '+17.400s', '+21.200s', '+25.800s', '+30.900s', '+36.400s', '+42.800s', '+49.500s', '+57.100s'],
      dnfs: [
        { code: 'LE', status: 'Avería mecánica', lap: 14 },
        { code: 'GLA', status: 'Toque alerón', lap: 6 }
      ],
      fastestLap: { code: 'NAE', time: '1:47.410', lap: 12 }
    }
  }
};
