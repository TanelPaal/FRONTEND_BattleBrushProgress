"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MiniatureCollectionService } from "@/services/MiniatureCollectionService";
import { MiniatureService } from "@/services/MiniatureService";
import { MiniStateService } from "@/services/MiniStateService";
import { PersonService } from "@/services/PersonService";
import { IMiniatureCollection } from "@/types/domain/IMiniatureCollection";
import { IMiniature } from "@/types/domain/IMiniature";
import { IMiniState } from "@/types/domain/IMiniState";
import { IPerson } from "@/types/domain/IPerson";

export default function EditMiniatureCollectionPage() {
    const [form, setForm] = useState<Partial<IMiniatureCollection>>({});
    const [error, setError] = useState<string | null>(null);
    const [miniatures, setMiniatures] = useState<IMiniature[]>([]);
    const [miniStates, setMiniStates] = useState<IMiniState[]>([]);
    const [persons, setPersons] = useState<IPerson[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Fetch all related data
        const fetchMiniatures = async () => {
            const service = new MiniatureService();
            const result = await service.getAllAsync();
            if (result.data) setMiniatures(result.data);
        };
        const fetchMiniStates = async () => {
            const service = new MiniStateService();
            const result = await service.getAllAsync();
            if (result.data) setMiniStates(result.data);
        };
        const fetchPersons = async () => {
            const service = new PersonService();
            const result = await service.getAllAsync();
            if (result.data) setPersons(result.data);
        };

        fetchMiniatures();
        fetchMiniStates();
        fetchPersons();
    }, []);

    useEffect(() => {
        // Fetch the current MiniatureCollection
        const fetchData = async () => {
            const service = new MiniatureCollectionService();
            const result = await service.getAsync(id!);
            if (result.data) {
                setForm(result.data);
            } else {
                setError(result.errors?.[0] ?? "Failed to fetch data");
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const service = new MiniatureCollectionService();
        const result = await service.updateAsync({
            id: id,
            collectionName: form.collectionName!,
            collectionDesc: form.collectionDesc!,
            acquisitionDate: form.acquisitionDate!,
            completionDate: form.completionDate!,
            miniatureId: form.miniatureId!,
            miniStateId: form.miniStateId!,
            personId: form.personId!
        } as IMiniatureCollection);
        if (result.errors) {
            setError(result.errors[0]);
        } else {
            navigate("/miniaturecollection");
        }
    };

    if (!form || !form.miniatureId || !form.miniStateId || !form.personId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Edit Miniature Collection</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Collection Name</label>
                    <input 
                        type="text" 
                        name="collectionName" 
                        className="form-control" 
                        value={form.collectionName ?? ""} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea 
                        name="collectionDesc" 
                        className="form-control" 
                        value={form.collectionDesc ?? ""} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Acquisition Date</label>
                    <input 
                        type="datetime-local" 
                        name="acquisitionDate" 
                        className="form-control" 
                        value={form.acquisitionDate ? new Date(form.acquisitionDate).toISOString().slice(0, 16) : ""} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Completion Date</label>
                    <input 
                        type="datetime-local" 
                        name="completionDate" 
                        className="form-control" 
                        value={form.completionDate ? new Date(form.completionDate).toISOString().slice(0, 16) : ""} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Miniature</label>
                    <select 
                        name="miniatureId" 
                        className="form-control" 
                        value={form.miniatureId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select a miniature</option>
                        {miniatures.map(miniature => (
                            <option key={miniature.id} value={miniature.id}>
                                {miniature.miniName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>State</label>
                    <select 
                        name="miniStateId" 
                        className="form-control" 
                        value={form.miniStateId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select a state</option>
                        {miniStates.map(state => (
                            <option key={state.id} value={state.id}>
                                {state.stateName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Person</label>
                    <select 
                        name="personId" 
                        className="form-control" 
                        value={form.personId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select a person</option>
                        {persons.map(person => (
                            <option key={person.id} value={person.id}>
                                {person.personName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/miniaturecollection")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
