"use client";

import { useEffect, useState } from "react";
import { MiniatureCollectionService } from "@/services/MiniatureCollectionService";
import { MiniPaintSwatchService } from "@/services/MiniPaintSwatchService";
import { PaintService } from "@/services/PaintService";
import { IMiniatureCollection } from "@/types/domain/IMiniatureCollection";
import { IMiniPaintSwatch } from "@/types/domain/IMiniPaintSwatch";
import MiniaturePaints from "@/components/MiniaturePaints";
import { PersonService } from "@/services/PersonService";
import { Link } from "react-router-dom";

export default function MiniatureCollectionPage() {
    const [miniatureCollections, setMiniatureCollections] = useState<IMiniatureCollection[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMiniState, setSelectedMiniState] = useState<string>("");
    const [selectedMiniature, setSelectedMiniature] = useState<string>("");
    const [miniatures, setMiniatures] = useState<{ id: string; miniName: string }[]>([]);
    const [miniStates, setMiniStates] = useState<{ id: string; stateName: string }[]>([]);
    const [paintSwatches, setPaintSwatches] = useState<Record<string, IMiniPaintSwatch[]>>({});
    const [paintsData, setPaintsData] = useState<Record<string, { name: string, hexCode: string }>>({});
    const [persons, setPersons] = useState<{ id: string; personName: string }[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collectionResult, swatchesResult, paintsResult] = await Promise.all([
                    new MiniatureCollectionService().getAllAsync(),
                    new MiniPaintSwatchService().getAllAsync(),
                    new PaintService().getAllAsync()
                ]);

                if (collectionResult.data) {
                    setMiniatureCollections(collectionResult.data);
                }

                if (paintsResult.data) {
                    const paintMap = paintsResult.data.reduce((acc, paint) => {
                        acc[paint.id] = {
                            name: paint.name,
                            hexCode: paint.hexCode
                        };
                        return acc;
                    }, {} as Record<string, { name: string, hexCode: string }>);
                    setPaintsData(paintMap);
                }

                if (swatchesResult.data) {
                    const enhancedSwatches = swatchesResult.data.map(swatch => ({
                        ...swatch,
                        personPaints: swatch.personPaints && {
                            ...swatch.personPaints,
                            paint: swatch.personPaints.paint && {
                                ...swatch.personPaints.paint,
                                ...paintsData[swatch.personPaints.paint.id]
                            }
                        }
                    }));

                    const swatchesByCollection = enhancedSwatches.reduce((acc, swatch) => {
                        if (!swatch.miniatureCollectionId) return acc;
                        if (!acc[swatch.miniatureCollectionId]) {
                            acc[swatch.miniatureCollectionId] = [];
                        }
                        acc[swatch.miniatureCollectionId].push(swatch);
                        return acc;
                    }, {} as Record<string, IMiniPaintSwatch[]>);
                    
                    setPaintSwatches(swatchesByCollection);
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Fetching miniatures...");
        const fetchMiniatures = async () => {
            const { MiniatureService } = await import("@/services/MiniatureService");
            const service = new MiniatureService();
            const result = await service.getAllAsync();
            if (result.data) setMiniatures(result.data);
        };
        fetchMiniatures().then(() => console.log("Fetched miniatures"));
    }, []);

    useEffect(() => {
        const fetchMiniStates = async () => {
            const { MiniStateService } = await import("@/services/MiniStateService");
            const service = new MiniStateService();
            const result = await service.getAllAsync();
            if (result.data) setMiniStates(result.data);
        };
        fetchMiniStates();
    }, []);

    useEffect(() => {
        const fetchPersons = async () => {
            const service = new PersonService();
            const result = await service.getAllAsync();
            if (result.data) setPersons(result.data);
        };
        fetchPersons();
    }, []);

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    // Filtering logic
    const filteredCollections = miniatureCollections.filter(mc =>
        (selectedMiniState === "" || mc.miniState?.stateName === selectedMiniState) &&
        (selectedMiniature === "" || mc.miniature?.miniName === selectedMiniature) &&
        (selectedPerson === "" || mc.person?.personName === selectedPerson)
    );

    return (
        <div className="container mt-4">
            <h1>Miniature Collections</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Link to="/miniaturecollection/create" className="btn btn-primary mb-3">Add New Collection</Link>
            <div className="mb-3 d-flex gap-3">
                <select value={selectedMiniState} onChange={e => setSelectedMiniState(e.target.value)} className="form-select" style={{width: 200}}>
                    <option value="">All States</option>
                    {miniStates.map(ms => <option key={ms.id} value={ms.stateName}>{ms.stateName}</option>)}
                </select>
                <select value={selectedMiniature} onChange={e => setSelectedMiniature(e.target.value)} className="form-select" style={{width: 200}}>
                    <option value="">All Miniatures</option>
                    {miniatures.map(m => <option key={m.id} value={m.miniName}>{m.miniName}</option>)}
                </select>
                <select value={selectedPerson} onChange={e => setSelectedPerson(e.target.value)} className="form-select" style={{width: 200}}>
                    <option value="">All Persons</option>
                    {persons.map(p => <option key={p.id} value={p.personName}>{p.personName}</option>)}
                </select>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Collection Name</th>
                        <th>Description</th>
                        <th>Acquisition Date</th>
                        <th>Completion Date</th>
                        <th>Miniature</th>
                        <th>State</th>
                        <th>Person</th>
                        <th>Paints Used</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCollections.map((collection) => (
                        <tr key={collection.id}>
                            <td>{collection.collectionName}</td>
                            <td>{collection.collectionDesc}</td>
                            <td>{new Date(collection.acquisitionDate).toLocaleDateString()}</td>
                            <td>{new Date(collection.completionDate).toLocaleDateString()}</td>
                            <td>{collection.miniature?.miniName}</td>
                            <td>{collection.miniState?.stateName}</td>
                            <td>{collection.person?.personName}</td>
                            <td>
                                <MiniaturePaints 
                                    swatches={paintSwatches[collection.id] || []} 
                                />
                            </td>
                            <td>
                                <Link 
                                    to={`/miniaturecollection/edit/${collection.id}`} 
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    Edit
                                </Link>
                                <Link 
                                    to={`/miniaturecollection/delete/${collection.id}`} 
                                    className="btn btn-sm btn-danger"
                                >
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
