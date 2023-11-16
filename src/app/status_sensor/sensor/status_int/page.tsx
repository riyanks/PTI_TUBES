import SensorDataStatus from '@/components/data/SensorDataStatus'

export default function IntensitymeterPage() {
  return <SensorDataStatus sensorType="Intensitymeter" endpoint="http://127.0.0.1:3000/sensor/status_int" />
}
