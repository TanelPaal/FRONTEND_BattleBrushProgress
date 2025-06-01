"use client";

import { AccountContext } from "@/context/AccountContext";
import { PersonService } from "@/services/PersonService";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IPerson } from "@/types/domain/IPerson";
import { Link } from "react-router-dom";

export default function Person() {
	const personService = new PersonService();
	const { accountInfo } = useContext(AccountContext);
	const navigate = useNavigate();
	const [data, setData] = useState<IPerson[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!accountInfo?.jwt) {
			navigate("/login");
		}

		const fetchData = async () => {
			try {
				const result = await personService.getAllAsync();
				if (result.errors) {
					console.log(result.errors);
					setError(result.errors[0] ?? "Failed to fetch data");
					return;
				}
				setData(result.data!);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error instanceof Error ? error.message : "An error occurred");
			}
		};

		fetchData();
	}, []);

	if (data.length === 0) {
		return (
			<div className="container mt-4">
				<h1>Persons</h1>
				<Link to="/persons/create" className="btn btn-primary mb-3">Create New Person</Link>
				{error && <div className="alert alert-danger">{error}</div>}
				<div>No Persons found.</div>
			</div>
		);
	}

	return (
		<div className="container mt-4">
			<h1>Persons</h1>
			<Link to="/persons/create" className="btn btn-primary mb-3">Create New Person</Link>
			{error && <div className="alert alert-danger">{error}</div>}
			<table className="table">
				<thead>
					<tr>
						<th>Name</th>
						<th style={{ width: "180px" }}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item) =>
						<tr key={item.id}>
							<td>{item.personName}</td>
							<td>
								<Link to={`/persons/edit/${item.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
								<Link to={`/persons/delete/${item.id}`} className="btn btn-danger btn-sm">Delete</Link>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
