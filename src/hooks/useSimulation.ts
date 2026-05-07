'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertEvent, TrainInfo, trains as initialTrains, generateAlerts, type AlertSeverity, type ObjectType } from '@/data/mockData';

const objectTypes: ObjectType[] = ['落石', '倒塌樹木', '工程車輛', '誤闖人員', '動物', '不明物體'];
const locations = ['苗栗三義段 K152+300', '新竹關西段 K89+150', '雲林斗六段 K210+800', '嘉義竹崎段 K245+600', '台中豐原段 K175+200', '桃園龍潭段 K65+400'];

export function useSimulation() {
  const [trainList, setTrainList] = useState<TrainInfo[]>(initialTrains);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [totalDetections, setTotalDetections] = useState(247);
  const [systemUptime, setSystemUptime] = useState(99.7);
  const alertCounter = useRef(1100);

  const addRandomAlert = useCallback(() => {
    const sev: AlertSeverity = Math.random() < 0.15 ? 'critical' : Math.random() < 0.4 ? 'warning' : 'info';
    const obj = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const newAlert: AlertEvent = {
      id: `ALT-${alertCounter.current++}`,
      timestamp: new Date().toISOString(),
      severity: sev,
      objectType: obj,
      location: loc,
      distance: Math.floor(Math.random() * 800 + 50),
      trainId: initialTrains[Math.floor(Math.random() * initialTrains.length)].id,
      description: `偵測到${obj}入侵軌道淨空區`,
      resolved: false,
      cameraId: `CAM-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}`,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    setTotalDetections(prev => prev + 1);
  }, []);

  useEffect(() => {
    setAlerts(generateAlerts(12));

    const trainInterval = setInterval(() => {
      setTrainList(prev => prev.map(t => {
        if (t.status === 'stopped') return t;
        const newPos = (t.position + (t.speed / 5000) * 100) % 100;
        return { ...t, position: newPos, speed: t.speed + (Math.random() - 0.5) * 5 };
      }));
    }, 200);

    const alertInterval = setInterval(() => {
      if (Math.random() < 0.3) addRandomAlert();
    }, 4000);

    return () => {
      clearInterval(trainInterval);
      clearInterval(alertInterval);
    };
  }, [addRandomAlert]);

  return { trainList, alerts, totalDetections, systemUptime, addRandomAlert };
}
