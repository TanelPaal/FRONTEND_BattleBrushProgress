export function getColorTag(hex: string | undefined): string {
    
    if (!hex) return "Unknown";
    const h = hex.replace("#", "");
    if (h.length !== 6) return "Unknown";
    const r = parseInt(h.substring(0,2), 16);
    const g = parseInt(h.substring(2,4), 16);
    const b = parseInt(h.substring(4,6), 16);

    // Grayscale
    if (r === g && g === b) {
        if (r < 30) return "Black";
        if (r < 100) return "Dark Gray";
        if (r < 200) return "Gray";
        return "White";
    }

    // Calculate HSL for more nuanced color detection
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let hVal = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: hVal = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: hVal = (bNorm - rNorm) / d + 2; break;
            case bNorm: hVal = (rNorm - gNorm) / d + 4; break;
        }
        hVal /= 6;
    }

    // Now use HSL for more precise color naming
    if (l < 0.15) return "Black";
    if (l > 0.85) return "White";
    if (s < 0.15) return "Gray";

    // Hue-based color detection
    const hue = hVal * 360;
    if (hue >= 0 && hue < 15) return l > 0.6 ? "Light Red" : "Red";
    if (hue >= 15 && hue < 45) return l > 0.6 ? "Light Orange" : "Orange";
    if (hue >= 45 && hue < 70) return l > 0.6 ? "Light Yellow" : "Yellow";
    if (hue >= 70 && hue < 170) return l > 0.6 ? "Light Green" : "Green";
    if (hue >= 170 && hue < 200) return l > 0.6 ? "Light Cyan" : "Cyan";
    if (hue >= 200 && hue < 250) return l > 0.6 ? "Light Blue" : "Blue";
    if (hue >= 250 && hue < 290) return l > 0.6 ? "Light Purple" : "Purple";
    if (hue >= 290 && hue < 330) return l > 0.6 ? "Light Magenta" : "Magenta";
    if (hue >= 330 && hue < 345) return l > 0.6 ? "Light Pink" : "Pink";
    if (hue >= 345 && hue <= 360) return l > 0.6 ? "Light Red" : "Red";

    // Special case for brown
    if (hue >= 20 && hue < 45 && l < 0.5) return "Brown";

    return "Other";
}
