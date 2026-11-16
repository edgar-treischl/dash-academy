/**
 * Example interactive lesson component: Sales Chart
 * 
 * This demonstrates how to create custom React components
 * that can be embedded in lessons using the component registry.
 * 
 * Usage in markdown:
 * ::: component SalesChart
 * {"title": "Q4 2024 Sales", "data": [{"month": "Oct", "sales": 15000}]}
 * :::
 */

interface SalesChartProps {
  title?: string;
  data?: Array<{ sart: string; sus: number }>;
}

export default function SalesChart({
  title = "SuS Over Time",
  data = [
    { sart: "GS", sus: 12000 },
    { sart: "MS", sus: 15000 },
    { sart: "RS", sus: 18000 },
    { sart: "GS", sus: 16000 }
  ]
}: SalesChartProps) {
  const maxSales = Math.max(...data.map(d => d.sus));
  
  return (
    <div className="learning-card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      
      <div style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        gap: "12px", 
        height: "250px",
        paddingBottom: "16px"
      }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${(item.sus / maxSales) * 200}px`,
                backgroundColor: "var(--learning-primary)",
                borderRadius: "4px 4px 0 0",
                marginBottom: "8px",
                transition: "all 0.2s ease"
              }}
              title={`${item.sart}: $${item.sus.toLocaleString()}`}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            />
            <span style={{ 
              fontSize: "12px", 
              color: "var(--learning-text-muted)",
              textAlign: "center"
            }}>
              {item.sart}
            </span>
          </div>
        ))}
      </div>
      
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse",
        marginTop: "16px"
      }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--learning-border)" }}>
            <th style={{ textAlign: "left", padding: "8px", fontWeight: 600 }}>Schulart</th>
            <th style={{ textAlign: "right", padding: "8px", fontWeight: 600 }}>SuS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid var(--learning-border-light)" }}>
              <td style={{ padding: "8px" }}>{item.sart}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {item.sus.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <p style={{ 
        fontSize: "12px", 
        color: "var(--learning-text-muted)",
        marginTop: "12px",
        marginBottom: 0
      }}>
        💡 Ein interaktiver Plot 
      </p>
    </div>
  );
}
