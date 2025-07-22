export default function Dashboard() {
  const stats = [
    { label: "Total Users", value: 128, color: "bg-blue-500" },
    { label: "Orders Today", value: 45, color: "bg-green-500" },
    { label: "Revenue", value: "$3,420", color: "bg-yellow-500" },
  ];

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} text-white p-4 rounded-lg shadow`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}