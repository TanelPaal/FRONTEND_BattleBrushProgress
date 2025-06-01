import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CHART_COLORS } from "@/helpers/chartColors";

// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: {
        labels: string[];
        values: number[];
    };
    title: string;
    height?: number;
    width?: number;
}

export function PieChart({ data, title, height = 250, width = 250 }: PieChartProps) {
    return (
        <>
            <h5>{title}</h5>
            <div style={{ width, height, margin: "0 auto" }}>
                <Pie
                    data={{
                        labels: data.labels,
                        datasets: [{
                            data: data.values,
                            backgroundColor: CHART_COLORS,
                        }]
                    }}
                    options={{
                        plugins: {
                            legend: { display: true, position: "bottom" as const },
                            tooltip: { enabled: true }
                        },
                        maintainAspectRatio: false
                    }}
                />
            </div>
        </>
    );
}
