import { getQualityStatus } from '../../lib/quality';

export default function QualityPage() {
  const status = getQualityStatus();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Quality Control</h1>
      <p>{status}</p>
    </div>
  );
}
