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
  line: 'western' | 'eastern' | 'southlink';
}

// 台鐵西部幹線（縱貫線 基隆→屏東）
export const westernStations: StationInfo[] = [
  { name: '基隆', x: 62, y:  5, riskLevel: 10, line: 'western' },
  { name: '台北', x: 57, y: 10, riskLevel: 12, line: 'western' },
  { name: '板橋', x: 53, y: 13, riskLevel: 15, line: 'western' },
  { name: '桃園', x: 46, y: 19, riskLevel: 35, line: 'western' },
  { name: '新竹', x: 37, y: 27, riskLevel: 28, line: 'western' },
  { name: '苗栗', x: 32, y: 36, riskLevel: 65, line: 'western' },
  { name: '台中', x: 27, y: 48, riskLevel: 42, line: 'western' },
  { name: '彰化', x: 24, y: 53, riskLevel: 22, line: 'western' },
  { name: '雲林', x: 21, y: 60, riskLevel: 55, line: 'western' },
  { name: '嘉義', x: 18, y: 66, riskLevel: 48, line: 'western' },
  { name: '台南', x: 14, y: 74, riskLevel: 30, line: 'western' },
  { name: '高雄', x: 12, y: 81, riskLevel: 18, line: 'western' },
  { name: '屏東', x: 18, y: 86, riskLevel: 20, line: 'western' },
];

// 台鐵東部幹線（宜蘭線→北迴線→花東線 台北→台東）
export const easternStations: StationInfo[] = [
  { name: '台北', x: 57, y: 10, riskLevel: 12, line: 'eastern' },
  { name: '瑞芳', x: 67, y: 12, riskLevel: 25, line: 'eastern' },
  { name: '宜蘭', x: 74, y: 20, riskLevel: 40, line: 'eastern' },
  { name: '羅東', x: 75, y: 24, riskLevel: 38, line: 'eastern' },
  { name: '蘇澳', x: 76, y: 28, riskLevel: 45, line: 'eastern' },
  { name: '花蓮', x: 77, y: 41, riskLevel: 72, line: 'eastern' },
  { name: '玉里', x: 75, y: 56, riskLevel: 58, line: 'eastern' },
  { name: '關山', x: 73, y: 63, riskLevel: 50, line: 'eastern' },
  { name: '台東', x: 70, y: 72, riskLevel: 45, line: 'eastern' },
];

// 南迴線（屏東枋寮→繞南端→台東）
export const southlinkStations: StationInfo[] = [
  { name: '高雄', x: 12, y: 81, riskLevel: 18, line: 'southlink' },
  { name: '枋寮', x: 16, y: 88, riskLevel: 30, line: 'southlink' },
  { name: '枋山', x: 19, y: 92, riskLevel: 35, line: 'southlink' },
  { name: '古莊', x: 35, y: 96, riskLevel: 40, line: 'southlink' },
  { name: '瀧溪', x: 52, y: 93, riskLevel: 42, line: 'southlink' },
  { name: '金崙', x: 61, y: 88, riskLevel: 38, line: 'southlink' },
  { name: '知本', x: 66, y: 82, riskLevel: 35, line: 'southlink' },
  { name: '台東', x: 70, y: 72, riskLevel: 45, line: 'southlink' },
];

// 向後相容：預設匯出西部幹線
export const stations: StationInfo[] = westernStations;

export const trains: TrainInfo[] = [
  { id: '102', name: '自強102', speed: 130, position: 20, line: 'western', status: 'normal' },
  { id: '108', name: '普悠瑪108', speed: 140, position: 55, line: 'eastern', status: 'normal' },
  { id: '206', name: '太魯閣206', speed: 145, position: 35, line: 'eastern', status: 'braking' },
  { id: '510', name: '莒光510', speed: 0,   position: 70, line: 'western', status: 'stopped' },
  { id: '4006', name: '區間4006', speed: 80,  position: 45, line: 'western', status: 'normal' },
  { id: '3006', name: '自強3006', speed: 110, position: 80, line: 'western', status: 'normal' },
];

const objectTypes: ObjectType[] = ['落石', '倒塌樹木', '工程車輛', '誤闖人員', '動物', '不明物體'];
const locations = [
  '苗栗三義段 K152+300', '花蓮秀林段 K253+100', '宜蘭礁溪段 K89+150',
  '雲林斗六段 K210+800', '嘉義竹崎段 K245+600', '台中豐原段 K175+200',
  '屏東枋山段 K411+500', '台東卑南段 K320+700', '新竹關西段 K65+400',
];

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
  { id: 'CAM-01', name: '車載前方攝影機 #1', type: '攝影機', location: '自強102 車頭', status: 'online', uptime: 99.8, lastPing: '2s ago', cpu: 35, temp: 42 },
  { id: 'CAM-02', name: '沿線固定攝影機 #2', type: '攝影機', location: '苗栗三義段', status: 'online', uptime: 98.5, lastPing: '1s ago', cpu: 28, temp: 38 },
  { id: 'CAM-03', name: '沿線固定攝影機 #3', type: '攝影機', location: '花蓮秀林段', status: 'warning', uptime: 95.2, lastPing: '15s ago', cpu: 72, temp: 65 },
  { id: 'CAM-04', name: '車載前方攝影機 #4', type: '攝影機', location: '太魯閣206 車頭', status: 'online', uptime: 99.1, lastPing: '1s ago', cpu: 30, temp: 40 },
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
