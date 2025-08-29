import { getRecipeStatus } from '../../lib/recipe';

export default function RecipePage() {
  const status = getRecipeStatus();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Recipe Management</h1>
      <p>{status}</p>
    </div>
  );
}
