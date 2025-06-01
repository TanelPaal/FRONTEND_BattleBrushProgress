"use client";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MiniPaintSwatchService } from "@/services/MiniPaintSwatchService";
import { MiniatureCollectionService } from "@/services/MiniatureCollectionService";
import { PersonPaintService } from "@/services/PersonPaintService";
import { IMiniPaintSwatch } from "@/types/domain/IMiniPaintSwatch";
import { IMiniatureCollection } from "@/types/domain/IMiniatureCollection";
import { IPersonPaint } from "@/types/domain/IPersonPaint";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "@/context/AccountContext";

export default function MiniPaintSwatchCreate() {
    const { accountInfo } = useContext(AccountContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState<Partial<IMiniPaintSwatch>>({
        usageType: "",
        notes: "",
        miniatureCollectionId: "",
        personPaintsId: ""
    });
    const [miniatureCollections, setMiniatureCollections] = useState<IMiniatureCollection[]>([]);
    const [personPaints, setPersonPaints] = useState<IPersonPaint[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const miniPaintSwatchService = new MiniPaintSwatchService();
            const result = await miniPaintSwatchService.addAsync(data as IMiniPaintSwatch);

            if (result.errors && result.errors.length > 0) {
                setErrorMessage(result.errors.join(", "));
                return;
            }

            setErrorMessage("");
            navigate("/minipaintswatch");
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    useEffect(() => {
        if (!accountInfo?.jwt) {
            navigate('/login');
        } else {
            const fetchMiniatureCollections = async () => {
                const service = new MiniatureCollectionService();
                const result = await service.getAllAsync();
                if (result.data) setMiniatureCollections(result.data);
            };
            fetchMiniatureCollections();

            const fetchPersonPaints = async () => {
                const service = new PersonPaintService();
                const result = await service.getAllAsync();
                if (result.data) setPersonPaints(result.data);
            };
            fetchPersonPaints();
        }
    }, [accountInfo, navigate]);

    return (
        <div className="container mt-4">
            <h1>Create Mini Paint Swatch</h1>
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Usage Type:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={data.usageType}
                                onChange={(e) => setData({ ...data, usageType: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Notes:</label>
                            <textarea
                                className="form-control"
                                value={data.notes}
                                onChange={(e) => setData({ ...data, notes: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Miniature Collection:</label>
                            <select
                                className="form-control"
                                value={data.miniatureCollectionId}
                                onChange={(e) => setData({ ...data, miniatureCollectionId: e.target.value })}
                                required
                            >
                                <option value="">Select a collection</option>
                                {miniatureCollections.map(mc => (
                                    <option key={mc.id} value={mc.id}>
                                        {mc.collectionName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label>Person Paint:</label>
                            <select
                                className="form-control"
                                value={data.personPaintsId}
                                onChange={(e) => setData({ ...data, personPaintsId: e.target.value })}
                                required
                            >
                                <option value="">Select a paint</option>
                                {personPaints.map(pp => (
                                    <option key={pp.id} value={pp.id}>
                                        {pp.paint?.name ?? pp.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Create</button>
                        <Link to="/minipaintswatch" className="btn btn-secondary ms-2">Back to List</Link>
                        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}
