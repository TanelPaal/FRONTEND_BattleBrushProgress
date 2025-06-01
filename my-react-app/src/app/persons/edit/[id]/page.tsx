"use client";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PersonService } from "@/services/PersonService";
import { IPerson } from "@/types/domain/IPerson";
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "@/context/AccountContext";

export default function PersonEdit() {
	const { id } = useParams();
	const { accountInfo } = useContext(AccountContext);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");
	const [data, setData] = useState<IPerson>();

	type Inputs = {
		personName: string
	}

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
		try {
			const personService = new PersonService();
			const result = await personService.updateAsync({ id: id!, personName: formData.personName });

			if (result.errors) {
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
			<h1>Edit Person</h1>
			<div className="row">
				<div className="col-md-6">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="form-group mb-3">
							<label htmlFor="personName">Name</label>
							<input
								{...register("personName", { required: true })}
								type="text"
								className="form-control"
								id="personName"
								defaultValue={data.personName}
							/>
							{errors.personName && <span className="text-danger">This field is required</span>}
						</div>
						<button type="submit" className="btn btn-primary">Save</button>
						<Link to="/persons" className="btn btn-secondary ms-2">Back to List</Link>
					</form>
					{errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
				</div>
			</div>
		</div>
	);
}
