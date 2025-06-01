"use client";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MiniPaintSwatchService } from "@/services/MiniPaintSwatchService";
import { IMiniPaintSwatch } from "@/types/domain/IMiniPaintSwatch";
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "@/context/AccountContext";

export default function MiniPaintSwatchDelete() {
    const { id } = useParams();
    const { accountInfo } = useContext(AccountContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState<IMiniPaintSwatch>();

    const deleteConfirmed = async () => {
        try {
            const miniPaintSwatchService = new MiniPaintSwatchService();
            const result = await miniPaintSwatchService.deleteAsync(id!);

            if (result.errors && result.errors.length > 0) {
                setErrorMessage("This cannot be deleted because it is linked to other records.");
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
            const fetchData = async () => {
                const miniPaintSwatchService = new MiniPaintSwatchService();
                const result = await miniPaintSwatchService.getAsync(id!);
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
            <h1>Delete Mini Paint Swatch</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="alert alert-danger">
                        Are you sure you want to delete this mini paint swatch?
                    </div>
                    <div className="form-group mb-3">
                        <label>Usage Type:</label>
                        <div>{data.usageType}</div>
                    </div>
                    <button onClick={deleteConfirmed} className="btn btn-danger">Delete</button>
                    <Link to="/minipaintswatch" className="btn btn-secondary ms-2">Back to List</Link>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}
