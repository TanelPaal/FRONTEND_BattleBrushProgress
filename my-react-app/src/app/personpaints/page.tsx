"use client";

import { useEffect, useState } from "react";
import { PersonPaintService } from "@/services/PersonPaintService";
import { IPersonPaint } from "@/types/domain/IPersonPaint";
import { Link } from "react-router-dom";
import { getColorTag } from "@/helpers/colorHelper";

export default function PersonPaintsPage() {
    const [personPaints, setPersonPaints] = useState<IPersonPaint[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filteredPaints, setFilteredPaints] = useState<IPersonPaint[]>([]);
    const [filterOptions, setFilterOptions] = useState({
        brands: [] as string[],
        paintTypes: [] as string[],
        paintLines: [] as string[],
        colorTags: [] as string[]
    });

    // Filter states
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedPaintType, setSelectedPaintType] = useState("");
    const [selectedPaintLine, setSelectedPaintLine] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const service = new PersonPaintService();
                const result = await service.getAllAsync();
                
                if (result.data) {
                    setPersonPaints(result.data);
                    
                    // Extract unique filter options
                    const brands = Array.from(new Set(
                        result.data.map(pp => pp.paint?.brand?.brandName).filter(Boolean)
                    )) as string[];
                    
                    const paintTypes = Array.from(new Set(
                        result.data.map(pp => pp.paint?.paintType?.name).filter(Boolean)
                    )) as string[];
                    
                    const paintLines = Array.from(new Set(
                        result.data.map(pp => pp.paint?.paintLine?.paintLineName).filter(Boolean)
                    )) as string[];
                    
                    const colorTags = Array.from(new Set(
                        result.data.map(pp => getColorTag(pp.paint?.hexCode)).filter(Boolean)
                    )) as string[];

                    setFilterOptions({
                        brands,
                        paintTypes,
                        paintLines,
                        colorTags
                    });
                } else {
                    setError(result.errors?.[0] ?? "Failed to fetch data");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = personPaints.filter(pp =>
            (selectedBrand === "" || pp.paint?.brand?.brandName === selectedBrand) &&
            (selectedPaintType === "" || pp.paint?.paintType?.name === selectedPaintType) &&
            (selectedPaintLine === "" || pp.paint?.paintLine?.paintLineName === selectedPaintLine) &&
            (selectedColor === "" || getColorTag(pp.paint?.hexCode) === selectedColor)
        );
        setFilteredPaints(filtered);
    }, [personPaints, selectedBrand, selectedPaintType, selectedPaintLine, selectedColor]);

    return (
        <div className="container mt-4">
            <h1>Person Paints</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedBrand}
                        onChange={e => setSelectedBrand(e.target.value)}
                    >
                        <option value="">All Brands</option>
                        {filterOptions.brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedPaintType}
                        onChange={e => setSelectedPaintType(e.target.value)}
                    >
                        <option value="">All Paint Types</option>
                        {filterOptions.paintTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedPaintLine}
                        onChange={e => setSelectedPaintLine(e.target.value)}
                    >
                        <option value="">All Paint Lines</option>
                        {filterOptions.paintLines.map(line => (
                            <option key={line} value={line}>{line}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                    >
                        <option value="">All Colors</option>
                        {filterOptions.colorTags.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Link to="/personpaints/create" className="btn btn-primary mb-3">Add New</Link>

            <table className="table">
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Acquisition Date</th>
                        <th>Person Name</th>
                        <th>Paint Name</th>
                        <th>Brand</th>
                        <th>Paint Type</th>
                        <th>Paint Line</th>
                        <th>Color</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPaints.map((paint) => (
                        <tr key={paint.id}>
                            <td>{paint.quantity}</td>
                            <td>{new Date(paint.acquisitionDate).toLocaleDateString()}</td>
                            <td>{paint.person?.personName}</td>
                            <td>{paint.paint?.name}</td>
                            <td>{paint.paint?.brand?.brandName}</td>
                            <td>{paint.paint?.paintType?.name}</td>
                            <td>{paint.paint?.paintLine?.paintLineName}</td>
                            <td>
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "1.5em",
                                        height: "1.5em",
                                        background: paint.paint?.hexCode ? `#${paint.paint.hexCode}` : "transparent",
                                        border: "1px solid #ccc",
                                        marginRight: "0.5em",
                                        verticalAlign: "middle"
                                    }}
                                    title={`${paint.paint?.hexCode} (${getColorTag(paint.paint?.hexCode)})`}
                                />
                                {paint.paint?.hexCode}
                            </td>
                            <td>
                                <Link to={`/personpaints/edit/${paint.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                <Link to={`/personpaints/delete/${paint.id}`} className="btn btn-sm btn-danger">Delete</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
