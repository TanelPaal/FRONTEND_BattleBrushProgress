"use client";

import { useContext, useEffect, useState } from "react";
import { PersonPaintService } from "@/services/PersonPaintService";
import { IPersonPaint } from "@/types/domain/IPersonPaint";
import { AccountContext } from "@/context/AccountContext";
import { useNavigate, useParams } from "react-router-dom";

export default function PersonPaintDelete() {
    const { id } = useParams();
    const { accountInfo } = useContext(AccountContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const personPaintService = new PersonPaintService();
    const [data, setData] = useState<IPersonPaint>();

    const deleteConfirmed = async () => {
        try {
            var result = await personPaintService.deleteAsync(id!);

            if (result.errors && result.errors.length > 0) {
                setErrorMessage("This cannot be deleted because it is linked to a PaintSwatch.");
                return;
            } else {
                setErrorMessage("");
                navigate('/personpaints');
            }
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    useEffect(() => {
        if (!accountInfo?.jwt) {
            navigate('/login');
        } else {
            const fetchData = async () => { 
                const result = await personPaintService.getAsync(id!);
                if (result.data) {
                    setData(result.data);
                }
            };
            fetchData();
        }
    }, [id, accountInfo, navigate]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Delete Person Paint</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="alert alert-danger">
                        Are you sure you want to delete this paint?
                    </div>
                    <dl className="row">
                        <dt className="col-sm-2">ID</dt>
                        <dd className="col-sm-10">{data.id}</dd>
                        <dt className="col-sm-2">Quantity</dt>
                        <dd className="col-sm-10">{data.quantity}</dd>
                        <dt className="col-sm-2">Acquisition Date</dt>
                        <dd className="col-sm-10">{data.acquisitionDate}</dd>
                        <dt className="col-sm-2">Person Name</dt>
                        <dd className="col-sm-10">{data.person?.personName}</dd>
                        <dt className="col-sm-2">Paint Name</dt>
                        <dd className="col-sm-10">{data.paint?.name}</dd>
                    </dl>
                    <div className="mt-3">
                        <button onClick={deleteConfirmed} type="button" className="btn btn-danger me-2">Delete</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/personpaints")}
                        >
                            Cancel
                        </button>
                    </div>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}
