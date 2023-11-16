import SensorData from '@/components/data/SensorData'

export default function IntensitymeterPage() {
  return <SensorData sensorType="Intensitymeter" endpoint="http://127.0.0.1:3000/sensor/status_int" />
}
