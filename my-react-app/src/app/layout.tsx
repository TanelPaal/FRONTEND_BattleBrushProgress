"use client";

import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import BootstrapActivation from "@/helpers/BootstrapActivation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-dark min-vh-100 d-flex flex-column">
			<Header />
			<div className="flex-grow-1 d-flex flex-column">
				<main role="main" className="flex-grow-1 py-4">
					<div className="container">
						{children}
					</div>
				</main>
			</div>
			<Footer />
			<BootstrapActivation />
		</div>
	);
}
