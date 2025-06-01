"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterDto } from "@/types/IRegisterDto";
import { Link } from "react-router-dom";

export default function Register() {
	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IRegisterDto>();

	const onSubmit: SubmitHandler<IRegisterDto> = async (data: IRegisterDto) => {
		console.log(data);
		setErrorMessage("Loading...");

		try {
			const result = await accountService.registerAsync(data);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}

			setErrorMessage("");

			if (result.data && setAccountInfo) {
				setAccountInfo({
					jwt: result.data.jwt,
					refreshToken: result.data.refreshToken
				});
				navigate("/");
			} else {
				setErrorMessage("Registration failed - Account context not available");
			}

		} catch (error) {
			setErrorMessage("Registration failed - " + (error as Error).message);
		}
	};

	return (
		<div className="container d-flex align-items-center justify-content-center my-5">
			<div className="card p-4 w-100" style={{ maxWidth: 400 }}>
				<h1 className="text-center mb-4">Register</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group mb-3">
						<label>First Name:</label>
						<input
							type="text"
							className="form-control"
							{...register("firstName", { required: true })}
						/>
						{errors.firstName && <span className="text-danger">This field is required</span>}
					</div>
					<div className="form-group mb-3">
						<label>Last Name:</label>
						<input
							type="text"
							className="form-control"
							{...register("lastName", { required: true })}
						/>
						{errors.lastName && <span className="text-danger">This field is required</span>}
					</div>
					<div className="form-group mb-3">
						<label>Email:</label>
						<input
							type="email"
							className="form-control"
							{...register("email", { required: true })}
						/>
						{errors.email && <span className="text-danger">This field is required</span>}
					</div>
					<div className="form-group mb-3">
						<label>Password:</label>
						<input
							type="password"
							className="form-control"
							{...register("password", { required: true })}
						/>
						{errors.password && <span className="text-danger">This field is required</span>}
					</div>
					<div className="d-flex justify-content-between align-items-center">
						<button type="submit" className="btn btn-primary">Register</button>
						<Link to="/login" className="btn btn-secondary">Back to Login</Link>
					</div>
					{errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
				</form>
			</div>
		</div>
	);
}
