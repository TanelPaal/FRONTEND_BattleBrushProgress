"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TokenService } from "@/services/TokenService";
import { ILoginInput } from "@/types/ILoginInput";

export default function Login() {
	const accountService = useMemo(() => new AccountService(), []);
	const { setAccountInfo } = useContext(AccountContext);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ILoginInput>();

	const onSubmit: SubmitHandler<ILoginInput> = async (data: ILoginInput) => {
		setErrorMessage("Loading...");

		try {
			const result = await accountService.loginAsync(data.email, data.password);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}

			setErrorMessage("");

			if (result.data && setAccountInfo) {
				TokenService.setTokens(result.data.jwt, result.data.refreshToken);
				setAccountInfo({
					jwt: result.data.jwt,
					refreshToken: result.data.refreshToken
				});
				navigate("/");
			} else {
				setErrorMessage("Login failed - Account context not available");
			}

		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};

	return (
		<div className="container d-flex align-items-center justify-content-center my-5">
			<div className="card p-4 w-100" style={{ maxWidth: 400 }}>
				<h1 className="text-center mb-4">Login</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
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
						<button type="submit" className="btn btn-primary">Login</button>
						<Link to="/register" className="btn btn-secondary">Register</Link>
					</div>
					{errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
				</form>
			</div>
		</div>
	);
}
