export default function BudgetDisplay({ budget }) {
  if (!budget) return null;
  return (
    <div className="bg-lightYellow p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-maroon mb-2">💰 Estimated Budget</h3>
      <div className="grid grid-cols-2 gap-2">
        <span>Flights:</span><span>${budget.flights}</span>
        <span>Accommodation:</span><span>${budget.accommodation}</span>
        <span>Food:</span><span>${budget.food}</span>
        <span>Activities:</span><span>${budget.activities}</span>
        <span className="font-bold">Total:</span><span className="font-bold">${budget.total}</span>
      </div>
    </div>
  );
}