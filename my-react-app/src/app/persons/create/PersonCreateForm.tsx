"use client";

import { useContext, useEffect, useState } from "react";
import { PersonService } from "@/services/PersonService";
import { useForm, SubmitHandler } from "react-hook-form"
import { AccountContext } from "@/context/AccountContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function PersonCreateForm() {
    const navigate = useNavigate();
	const { accountInfo } = useContext(AccountContext);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	type Inputs = {
		personName: string
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({});


	
	useEffect(() => {
		const checkAuth = async () => {
			if (!accountInfo?.jwt) {
				navigate('/login');
			}
			setIsLoading(false);
		};
		
		checkAuth();
	}, [accountInfo, navigate]);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setErrorMessage("Loading...");
		try {
			const personService = new PersonService();
			const result = await personService.addAsync({ personName: data.personName });

			if (result.errors && result.errors.length > 0) {
				setErrorMessage(result.statusCode + " - " + result.errors.join(", "));
				return;
			}
			
			setErrorMessage("");
			navigate('/persons');

		} catch (error) {
			setErrorMessage((error as Error).message);
		}
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<h4>Create Person</h4>
			<hr />
			<div className="row">
				<div className="col-md-4">
					<form onSubmit={handleSubmit(onSubmit)}>
						{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

						<div className="form-group">
							<label className="control-label" htmlFor="personName">Nimi</label>
							<input
								className="form-control"
								type="text"
								id="personName"
								maxLength={128}
								placeholder="Name"
								{...register("personName", { required: true })}
							/>
							{errors.personName &&
								<span className="text-danger">This field is required!</span>
							}
						</div>

						<div className="form-group">
							<input type="submit" value="Create" className="btn btn-primary" />
						</div>
					</form>
				</div>
			</div>

			<div>
				<Link to={"/persons"}>Back to List</Link>
			</div>
		</>
	);
}
