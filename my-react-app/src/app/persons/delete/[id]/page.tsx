"use client";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PersonService } from "@/services/PersonService";
import { IPerson } from "@/types/domain/IPerson";
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "@/context/AccountContext";

export default function PersonDelete() {
	const { id } = useParams();
	const { accountInfo } = useContext(AccountContext);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [data, setData] = useState<IPerson>();

	const deleteConfirmed = async () => {
		try {
			const personService = new PersonService();
			const result = await personService.deleteAsync(id!);

			if (result.errors && result.errors.length > 0) {
				setErrorMessage(result.statusCode + " - " + result.errors.join(", "));
				return;
			}

			setErrorMessage("");
			navigate("/persons");
		} catch (error) {
			setErrorMessage((error as Error).message);
		}
	};

	useEffect(() => {
		if (!accountInfo?.jwt) {
			navigate('/login');
		} else {
			const fetchData = async () => {
				const personService = new PersonService();
				const result = await personService.getAsync(id!);
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
			<h1>Delete Person</h1>
			<div className="row">
				<div className="col-md-6">
					<div className="alert alert-danger">
						Are you sure you want to delete this person?
					</div>
					<div className="form-group mb-3">
						<label>Name:</label>
						<div>{data.personName}</div>
					</div>
					<button onClick={deleteConfirmed} className="btn btn-danger">Delete</button>
					<Link to="/persons" className="btn btn-secondary ms-2">Back to List</Link>
					{errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
				</div>
			</div>
		</div>
	);
}
