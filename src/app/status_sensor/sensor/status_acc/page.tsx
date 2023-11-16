import SensorDataStatus from '@/components/data/SensorDataStatus'

export default function AccelerographPage() {
  return <SensorDataStatus sensorType="Accelerograph" endpoint="http://127.0.0.1:3001/sensor/status_acc" />
}
