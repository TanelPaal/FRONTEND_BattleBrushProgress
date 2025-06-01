"use client";

import { AccountContext } from "@/context/AccountContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function Header() {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);
	const navigate = useNavigate();

	return (
		<>
			<nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3 sticky-top" style={{ zIndex: 1030 }}>
				<div className="container">

					<Link className="navbar-brand" to="/">BattleBrushProgress</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
							aria-controls="navbarSupportedContent"
							aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
						<ul className="navbar-nav flex-grow-1">
							<li className="nav-item">
								<Link className="nav-link text-dark" to="/">Home</Link>
							</li>

							{accountInfo?.jwt &&
								<li className="nav-item dropdown">
									<a className="nav-link text-dark dropdown-toggle" href="javascript:{}" id="userDropdown"
									   role="button" data-bs-toggle="dropdown" aria-expanded="false">User</a>
									<div className="dropdown-menu" aria-labelledby="userDropdown">
										<Link className="dropdown-item text-dark" to="/persons">Persons</Link>
										<Link className="dropdown-item text-dark" to="/personpaints">Person Paints</Link>
										<Link className="dropdown-item text-dark" to="/miniaturecollection">Miniature Collections</Link>
										<Link className="dropdown-item text-dark" to="/minipaintswatch">Mini Paint Swatches</Link>
										{/*Add more later*/}
									</div>
								</li>
							}
						</ul>

						<ul className="navbar-nav">
							<li className="nav-item">
								{accountInfo?.jwt &&
									<a className="nav-link text-dark" href="#" onClick={() => {
										setAccountInfo!({});
										navigate("/login");
									}}>Logout</a>
								}
								{!accountInfo?.jwt &&
									<Link className="nav-link text-dark" to="/login">Login</Link>
								}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
