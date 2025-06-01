"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PersonPaintService } from "@/services/PersonPaintService";
import { PersonService } from "@/services/PersonService";
import { PaintService } from "@/services/PaintService";
import { IPersonPaint } from "@/types/domain/IPersonPaint";
import { IPerson } from "@/types/domain/IPerson";
import { IPaint } from "@/types/domain/IPaint";

export default function EditPersonPaintPage() {
    const [form, setForm] = useState<Partial<IPersonPaint>>({});
    const [error, setError] = useState<string | null>(null);
    const [persons, setPersons] = useState<IPerson[]>([]);
    const [paints, setPaints] = useState<IPaint[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Fetch all persons and paints
        const fetchPersons = async () => {
            const service = new PersonService();
            const result = await service.getAllAsync();
            if (result.data) setPersons(result.data);
        };
        const fetchPaints = async () => {
            const service = new PaintService();
            const result = await service.getAllAsync();
            if (result.data) setPaints(result.data);
        };
        fetchPersons();
        fetchPaints();
    }, []);

    useEffect(() => {
        // Fetch the current PersonPaint
        const fetchData = async () => {
            const service = new PersonPaintService();
            const result = await service.getAsync( id!);
            if (result.data) {
                setForm(result.data);
            } else {
                setError(result.errors?.[0] ?? "Failed to fetch data");
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const service = new PersonPaintService();
        const result = await service.updateAsync({
            id: id,
            quantity: Number(form.quantity),
            acquisitionDate: form.acquisitionDate!,
            personId: form.personId!,
            paintId: form.paintId!
        } as IPersonPaint);
        if (result.errors) {
            setError(result.errors[0]);
        } else {
            navigate("/personpaints");
        }
    };

    if (!form || !form.personId || !form.paintId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Edit Person Paint</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Quantity</label>
                    <input type="number" name="quantity" className="form-control" value={form.quantity ?? ""} onChange={handleChange} required />
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
                    <label>Person</label>
                    <select name="personId" className="form-control" value={form.personId} onChange={handleChange} required>
                        <option value="">Select a person</option>
                        {persons.map(person => (
                            <option key={person.id} value={person.id}>{person.personName}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Paint</label>
                    <select name="paintId" className="form-control" value={form.paintId} onChange={handleChange} required>
                        <option value="">Select a paint</option>
                        {paints.map(paint => (
                            <option key={paint.id} value={paint.id}>
                                {paint.name}{paint.hexCode ? ` (${paint.hexCode})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/personpaints")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
