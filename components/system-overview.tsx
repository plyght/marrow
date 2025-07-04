const systemPoints = [
  {
    number: "01",
    title: "Tax spending, not wages",
    description: "A progressive consumption tax replaces most income tax, so the more you buy, the higher your rate, while savings and investment stay untouched."
  },
  {
    number: "02", 
    title: "Tax land, not buildings",
    description: "An annual land-value tax captures unearned location gains and is almost impossible to dodge or distort."
  },
  {
    number: "03",
    title: "Price pollution and trading churn", 
    description: "Add a carbon fee that is rebated to everyone and a tiny securities-settlement levy."
  },
  {
    number: "04",
    title: "AI autopilot",
    description: "An open-source algorithm watches inequality, demographics, and emissions, then nudges the tax bands every quarter; any change is logged on a public Git ledger."
  },
  {
    number: "05",
    title: "Universal give-back",
    description: "Revenue funds free healthcare, K-14 schooling, childcare, and a sliding cash credit, plus a citizen dividend invested in a national fund."
  }
];

export default function SystemOverview() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--calcium-ivory)' }}>
          The Marrow System
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--slate-graphite)' }}>
          Nordic-level equality with lower payroll taxes and full on-chain transparency
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {systemPoints.map((point, index) => (
          <div 
            key={index}
            className="p-6 rounded-lg border border-opacity-20 hover:border-opacity-40 transition-all duration-300"
            style={{ 
              borderColor: 'var(--slate-graphite)',
              backgroundColor: 'rgba(43, 49, 56, 0.1)'
            }}
          >
            <div className="flex items-start gap-4">
              <span 
                className="text-2xl font-bold flex-shrink-0"
                style={{ color: 'var(--electric-cyan)' }}
              >
                {point.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--calcium-ivory)' }}>
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-graphite)' }}>
                  {point.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}