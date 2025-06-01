"use client";

import { useEffect, useState } from "react";
import { PersonPaintService } from "@/services/PersonPaintService";
import { PersonService } from "@/services/PersonService";
import { PaintService } from "@/services/PaintService";
import { IPersonPaintAdd } from "@/types/domain/IPersonPaintAdd";
import { IPerson } from "@/types/domain/IPerson";
import { IPaint } from "@/types/domain/IPaint";
import { useNavigate } from "react-router-dom";

export default function CreatePersonPaintPage() {
    const [form, setForm] = useState<Partial<IPersonPaintAdd>>({});
    const [error, setError] = useState<string | null>(null);
    const [persons, setPersons] = useState<IPerson[]>([]);
    const [paints, setPaints] = useState<IPaint[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch persons
                const personService = new PersonService();
                const personResult = await personService.getAllAsync();
                if (personResult.data) setPersons(personResult.data);

                // Fetch paints
                const paintService = new PaintService();
                const paintResult = await paintService.getAllAsync();
                if (paintResult.data) setPaints(paintResult.data);
            } catch (error) {
                setError((error as Error).message);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const service = new PersonPaintService();
            const result = await service.addAsync({
                quantity: Number(form.quantity),
                acquisitionDate: form.acquisitionDate!,
                personId: form.personId!,
                paintId: form.paintId!
            });
            
            if (result.errors) {
                setError(result.errors[0]);
            } else {
                navigate("/personpaints");
            }
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Add Person Paint</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Quantity</label>
                    <input type="number" name="quantity" className="form-control" value={form.quantity ?? ""} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Acquisition Date</label>
                    <input type="datetime-local" name="acquisitionDate" className="form-control" value={form.acquisitionDate ?? ""} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Person</label>
                    <select name="personId" className="form-control" value={form.personId ?? ""} onChange={handleChange} required>
                        <option value="">Select a person</option>
                        {persons.map(person => (
                            <option key={person.id} value={person.id}>{person.personName}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Paint</label>
                    <select name="paintId" className="form-control" value={form.paintId ?? ""} onChange={handleChange} required>
                        <option value="">Select a paint</option>
                        {paints.map(paint => (
                            <option key={paint.id} value={paint.id}>
                                {paint.name}{paint.hexCode ? ` (${paint.hexCode})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
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
