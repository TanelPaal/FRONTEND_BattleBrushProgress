"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniatureCollectionService } from "@/services/MiniatureCollectionService";
import { MiniatureService } from "@/services/MiniatureService";
import { MiniStateService } from "@/services/MiniStateService";
import { PersonService } from "@/services/PersonService";
import { IMiniatureCollectionAdd } from "@/types/domain/IMiniatureCollectionAdd";
import { IMiniature } from "@/types/domain/IMiniature";
import { IMiniState } from "@/types/domain/IMiniState";
import { IPerson } from "@/types/domain/IPerson";

export default function CreateMiniatureCollectionPage() {
    const [form, setForm] = useState<Partial<IMiniatureCollectionAdd>>({});
    const [error, setError] = useState<string | null>(null);
    const [miniatures, setMiniatures] = useState<IMiniature[]>([]);
    const [miniStates, setMiniStates] = useState<IMiniState[]>([]);
    const [persons, setPersons] = useState<IPerson[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch miniatures
        const fetchMiniatures = async () => {
            const service = new MiniatureService();
            const result = await service.getAllAsync();
            if (result.data) setMiniatures(result.data);
        };
        // Fetch mini states
        const fetchMiniStates = async () => {
            const service = new MiniStateService();
            const result = await service.getAllAsync();
            if (result.data) setMiniStates(result.data);
        };
        // Fetch persons
        const fetchPersons = async () => {
            const service = new PersonService();
            const result = await service.getAllAsync();
            if (result.data) setPersons(result.data);
        };

        fetchMiniatures();
        fetchMiniStates();
        fetchPersons();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const service = new MiniatureCollectionService();
        const result = await service.addAsync({
            collectionName: form.collectionName!,
            collectionDesc: form.collectionDesc!,
            acquisitionDate: form.acquisitionDate!,
            completionDate: form.completionDate!,
            miniatureId: form.miniatureId!,
            miniStateId: form.miniStateId!,
            personId: form.personId!
        });
        if (result.errors) {
            setError(result.errors[0]);
        } else {
            navigate("/miniaturecollection");
        }
    };

    return (
        <div className="container mt-4">
            <h1>Add Miniature Collection</h1>
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
                        value={form.acquisitionDate ?? ""} 
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
                        value={form.completionDate ?? ""} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Miniature</label>
                    <select 
                        name="miniatureId" 
                        className="form-control" 
                        value={form.miniatureId ?? ""} 
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
                        value={form.miniStateId ?? ""} 
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
                        value={form.personId ?? ""} 
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
                <button type="submit" className="btn btn-primary">Add Collection</button>
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
