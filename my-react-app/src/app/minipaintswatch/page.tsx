"use client";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MiniPaintSwatchService } from "@/services/MiniPaintSwatchService";
import { IMiniPaintSwatch } from "@/types/domain/IMiniPaintSwatch";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "@/context/AccountContext";

export default function MiniPaintSwatchList() {
    const { accountInfo } = useContext(AccountContext);
    const navigate = useNavigate();
    const [errorMessage] = useState("");
    const [data, setData] = useState<IMiniPaintSwatch[]>([]);

    useEffect(() => {
        if (!accountInfo?.jwt) {
            navigate('/login');
        } else {
            const fetchData = async () => {
                const miniPaintSwatchService = new MiniPaintSwatchService();
                const result = await miniPaintSwatchService.getAllAsync();
                if (result.data) {
                    setData(result.data);
                }
            };
            fetchData();
        }
    }, [accountInfo, navigate]);

    return (
        <div className="container mt-4">
            <h1>Mini Paint Swatches</h1>
            <div className="row">
                <div className="col-md-12">
                    <Link to="/minipaintswatch/create" className="btn btn-primary mb-3">Create New</Link>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Usage Type</th>
                                <th>Notes</th>
                                <th>Miniature Collection</th>
                                <th>Person Paint</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td>{item.usageType}</td>
                                    <td>{item.notes}</td>
                                    <td>{item.miniatureCollection?.collectionName}</td>
                                    <td>{item.personPaints?.paint?.name}</td>
                                    <td>
                                        <Link to={`/minipaintswatch/edit/${item.id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                                        <Link to={`/minipaintswatch/delete/${item.id}`} className="btn btn-danger btn-sm">Delete</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
