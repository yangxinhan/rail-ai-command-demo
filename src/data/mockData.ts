export type AlertSeverity = 'critical' | 'warning' | 'info';
export type ObjectType = '落石' | '倒塌樹木' | '工程車輛' | '誤闖人員' | '動物' | '不明物體';
export type DeviceType = '攝影機' | 'LiDAR' | '邊緣主機';
export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface TrainInfo {
  id: string;
  name: string;
  speed: number;
  position: number; // 0-100 percentage along route
  line: string;
  status: 'normal' | 'braking' | 'stopped';
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  objectType: ObjectType;
  location: string;
  distance: number;
  trainId: string;
  description: string;
  resolved: boolean;
  cameraId: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  uptime: number;
  lastPing: string;
  cpu?: number;
  temp?: number;
}

export interface StationInfo {
  name: string;
  x: number;
  y: number;
  riskLevel: number;
}

export const stations: StationInfo[] = [
  { name: '台北', x: 85, y: 15, riskLevel: 12 },
  { name: '板橋', x: 78, y: 22, riskLevel: 18 },
  { name: '桃園', x: 65, y: 30, riskLevel: 35 },
  { name: '新竹', x: 52, y: 40, riskLevel: 28 },
  { name: '苗栗', x: 45, y: 50, riskLevel: 65 },
  { name: '台中', x: 40, y: 58, riskLevel: 42 },
  { name: '彰化', x: 38, y: 65, riskLevel: 22 },
  { name: '雲林', x: 35, y: 72, riskLevel: 55 },
  { name: '嘉義', x: 30, y: 78, riskLevel: 48 },
  { name: '台南', x: 25, y: 85, riskLevel: 30 },
  { name: '高雄', x: 20, y: 92, riskLevel: 15 },
];

export const trains: TrainInfo[] = [
  { id: 'T101', name: '自強號 101', speed: 130, position: 25, line: '西部幹線', status: 'normal' },
  { id: 'T203', name: '太魯閣 203', speed: 150, position: 55, line: '西部幹線', status: 'normal' },
  { id: 'T305', name: '普悠瑪 305', speed: 0, position: 72, line: '西部幹線', status: 'stopped' },
  { id: 'T407', name: '自強號 407', speed: 85, position: 90, line: '西部幹線', status: 'normal' },
  { id: 'T502', name: '區間車 502', speed: 60, position: 40, line: '西部幹線', status: 'braking' },
];

const objectTypes: ObjectType[] = ['落石', '倒塌樹木', '工程車輛', '誤闖人員', '動物', '不明物體'];
const locations = ['苗栗三義段 K152+300', '新竹關西段 K89+150', '雲林斗六段 K210+800', '嘉義竹崎段 K245+600', '台中豐原段 K175+200', '桃園龍潭段 K65+400'];

export function generateAlerts(count: number): AlertEvent[] {
  const alerts: AlertEvent[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const severity: AlertSeverity = i < 2 ? 'critical' : i < 5 ? 'warning' : 'info';
    const objType = objectTypes[i % objectTypes.length];
    alerts.push({
      id: `ALT-${String(1000 + i)}`,
      timestamp: new Date(now - i * 180000).toISOString(),
      severity,
      objectType: objType,
      location: locations[i % locations.length],
      distance: Math.floor(Math.random() * 800 + 50),
      trainId: trains[i % trains.length].id,
      description: `偵測到${objType}入侵軌道淨空區`,
      resolved: i > 3,
      cameraId: `CAM-${String(i % 4 + 1).padStart(2, '0')}`,
    });
  }
  return alerts;
}

export const devices: DeviceInfo[] = [
  { id: 'CAM-01', name: '車載前方攝影機 #1', type: '攝影機', location: 'T101 車頭', status: 'online', uptime: 99.8, lastPing: '2s ago', cpu: 35, temp: 42 },
  { id: 'CAM-02', name: '沿線固定攝影機 #2', type: '攝影機', location: '苗栗三義段', status: 'online', uptime: 98.5, lastPing: '1s ago', cpu: 28, temp: 38 },
  { id: 'CAM-03', name: '沿線固定攝影機 #3', type: '攝影機', location: '雲林斗六段', status: 'warning', uptime: 95.2, lastPing: '15s ago', cpu: 72, temp: 65 },
  { id: 'CAM-04', name: '車載前方攝影機 #4', type: '攝影機', location: 'T203 車頭', status: 'online', uptime: 99.1, lastPing: '1s ago', cpu: 30, temp: 40 },
  { id: 'LDR-01', name: 'LiDAR 感測器 #1', type: 'LiDAR', location: '苗栗三義段', status: 'online', uptime: 99.9, lastPing: '1s ago', cpu: 45, temp: 50 },
  { id: 'LDR-02', name: 'LiDAR 感測器 #2', type: 'LiDAR', location: '新竹關西段', status: 'online', uptime: 97.3, lastPing: '3s ago', cpu: 40, temp: 48 },
  { id: 'LDR-03', name: 'LiDAR 感測器 #3', type: 'LiDAR', location: '雲林斗六段', status: 'offline', uptime: 0, lastPing: '2m ago', cpu: 0, temp: 0 },
  { id: 'EDG-01', name: 'Jetson Orin 邊緣主機 #1', type: '邊緣主機', location: '苗栗三義段', status: 'online', uptime: 99.5, lastPing: '1s ago', cpu: 62, temp: 55 },
  { id: 'EDG-02', name: 'Jetson Orin 邊緣主機 #2', type: '邊緣主機', location: '新竹關西段', status: 'online', uptime: 98.8, lastPing: '2s ago', cpu: 55, temp: 52 },
  { id: 'EDG-03', name: 'Jetson AGX 邊緣主機 #3', type: '邊緣主機', location: '雲林斗六段', status: 'warning', uptime: 92.1, lastPing: '10s ago', cpu: 88, temp: 72 },
];

export const hourlyDetections = [4, 2, 1, 0, 1, 3, 8, 15, 22, 18, 12, 9, 14, 20, 16, 11, 8, 13, 19, 25, 17, 10, 7, 5];

export const objectDistribution = [
  { label: '落石', value: 38, color: '#ff6b35' },
  { label: '倒塌樹木', value: 22, color: '#00ff88' },
  { label: '工程車輛', value: 12, color: '#00d4ff' },
  { label: '誤闖人員', value: 15, color: '#ff3366' },
  { label: '動物', value: 8, color: '#ffcc00' },
  { label: '不明物體', value: 5, color: '#a855f7' },
];

export const riskTrend = [42, 38, 45, 52, 48, 55, 60, 58, 65, 62, 70, 68, 55, 50, 45, 48, 52, 58, 62, 56, 50, 45, 40, 38, 42, 48, 55, 50, 45, 42];
