import { getMaintenanceStatus } from '../../lib/maintenance';

export default function MaintenancePage() {
  const status = getMaintenanceStatus();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Maintenance</h1>
      <p>{status}</p>
    </div>
  );
}
