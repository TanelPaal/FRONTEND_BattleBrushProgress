interface Paint {
    id: string;
    usageType: string;
    notes: string;
    personPaints?: {
        paint?: {
            id: string;
            name: string;
            hexCode: string;
        };
    };
}

export default function MiniaturePaints({ swatches }: { swatches: Paint[] }) {
    if (!swatches || swatches.length === 0) {
        return <span className="text-muted">No paints recorded</span>;
    }

    // Group paints by usage type
    const groupedSwatches = swatches.reduce((acc, swatch) => {
        const type = swatch.usageType || 'Other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(swatch);
        return acc;
    }, {} as Record<string, Paint[]>);

    return (
        <div className="d-flex flex-column gap-2">
            {Object.entries(groupedSwatches).map(([usageType, typeSwatches]) => (
                <div key={usageType}>
                    <div className="fw-bold">{usageType}:</div>
                    <div className="d-flex flex-wrap gap-2">
                        {typeSwatches.map((swatch) => (
                            <div
                                key={swatch.id}
                                className="d-flex align-items-center"
                                title={swatch.notes || ''}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "1.5em",
                                        height: "1.5em",
                                        background: swatch.personPaints?.paint?.hexCode 
                                            ? `#${swatch.personPaints.paint.hexCode}` 
                                            : "transparent",
                                        border: "1px solid #ccc",
                                        marginRight: "0.5em",
                                        verticalAlign: "middle"
                                    }}
                                />
                                <span>
                                    {swatch.personPaints?.paint?.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
