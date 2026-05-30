export default function BudgetDisplay({ budget }) {
  if (!budget) {
    return <p className="text-gray-500">Budget information not available.</p>;
  }

  return (
    <div className="bg-maroon-100 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-maroon-900 mb-2">💰 Estimated Budget</h3>
      <div className="grid grid-cols-2 gap-2">
        <span>Flights:</span>
        <span>${budget.flights || 0}</span>
        <span>Accommodation:</span>
        <span>${budget.accommodation || 0}</span>
        <span>Food:</span>
        <span>${budget.food || 0}</span>
        <span>Activities:</span>
        <span>${budget.activities || 0}</span>
        <span className="font-bold">Total:</span>
        <span className="font-bold">${budget.total || 0}</span>
      </div>
    </div>
  );
}