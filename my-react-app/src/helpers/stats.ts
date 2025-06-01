export interface MiniatureStats {
    totalMiniatures: number;
    miniaturesByState: Record<string, number>;
}

export interface PaintStats {
    totalPaints: number;
    paintsByBrand: Record<string, number>;
    paintsByType: Record<string, number>;
}
