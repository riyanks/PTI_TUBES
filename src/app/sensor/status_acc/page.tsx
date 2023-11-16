import SensorData from '@/components/data/SensorData'

export default function AccelerographPage() {
  return <SensorData sensorType="Accelerograph" endpoint="http://127.0.0.1:3001/sensor/status_acc" />
}
