"use client";

import { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/context/AccountContext";
import { PieChart } from "@/components/PieChart";
import { StatsService } from "@/services/StatsService";
import { getUserIdFromJwt } from "@/helpers/jwtHelper";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MiniatureStats, PaintStats } from "@/helpers/stats";
import RandomMiniPicker from '@/components/RandomMiniPicker';

export default function HomePage() {
	const { accountInfo } = useContext(AccountContext);
	const [miniStats, setMiniStats] = useState<MiniatureStats | null>(null);
	const [paintStats, setPaintStats] = useState<PaintStats | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!accountInfo?.jwt) return;
		const userId = getUserIdFromJwt(accountInfo.jwt);
		if (!userId) {
			setError("No user ID found");
			return;
		}

		const fetchStats = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const statsService = new StatsService();
				const [miniData, paintData] = await Promise.all([
					statsService.getMiniatureStats(userId),
					statsService.getPaintStats(userId)
				]);
				
				setMiniStats(miniData);
				setPaintStats(paintData);
			} catch (error) {
				setError("Failed to fetch statistics");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [accountInfo]);

	if (!accountInfo?.jwt) {
		return (
			<div className="container-fluid bg-dark min-vh-100 d-flex flex-column">
				{/* Hero Section - centered vertically and horizontally */}
				<div className="flex-grow-1 d-flex align-items-center justify-content-center">
					<div className="container">
						<div className="hero-section card">
							<div className="card-body text-center py-5">
								<h1 className="hero-title mb-3">BattleBrushProgress</h1>
								<p className="hero-subtitle mb-4">Your Ultimate Miniature Painting Companion</p>
								<hr className="my-4 opacity-25" />
								<p className="feature-description mb-4">Track your progress, manage your paint collection, and organize your miniature painting journey.</p>
								<div className="d-flex justify-content-center gap-3">
									<a href="/register" className="btn btn-hero">Get Started</a>
									<a href="/login" className="btn btn-hero-outline">Sign In</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Features Section */}
				<div className="container mb-5">
					<div className="features-section">
						<h2 className="text-center mb-4 fw-bold">Features</h2>
						<div className="row g-4 justify-content-center">
							<div className="col-md-4 d-flex">
								<div className="feature-card card h-100 w-100 text-center">
									<div className="card-body">
										<div className="feature-icon mb-3 mx-auto d-flex align-items-center justify-content-center">
											<i className="bi bi-palette fs-2"></i>
										</div>
										<div className="feature-title">Paint Management</div>
										<div className="feature-description">Organize your paint collection by brand, type, and color. Never lose track of your paints again.</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 d-flex">
								<div className="feature-card card h-100 w-100 text-center">
									<div className="card-body">
										<div className="feature-icon mb-3 mx-auto d-flex align-items-center justify-content-center">
											<i className="bi bi-graph-up fs-2"></i>
										</div>
										<div className="feature-title">Progress Tracking</div>
										<div className="feature-description">Monitor your painting progress with detailed state tracking and statistics.</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 d-flex">
								<div className="feature-card card h-100 w-100 text-center">
									<div className="card-body">
										<div className="feature-icon mb-3 mx-auto d-flex align-items-center justify-content-center">
											<i className="bi bi-shuffle fs-2"></i>
										</div>
										<div className="feature-title">Random Picker</div>
										<div className="feature-description">Let our smart picker help you choose your next painting project.</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Statistics Section */}
				<div className="container mb-5">
					<div className="stats-section card">
						<div className="card-body">
							<div className="row text-center">
								<div className="col-md-4 mb-4 mb-md-0">
									<div className="stats-number">100%</div>
									<div className="stats-label">Paint Organization</div>
								</div>
								<div className="col-md-4 mb-4 mb-md-0">
									<div className="stats-number">Easy</div>
									<div className="stats-label">Progress Tracking</div>
								</div>
								<div className="col-md-4">
									<div className="stats-number">24/7</div>
									<div className="stats-label">Access</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Call to Action */}
				<div className="container">
					<div className="cta-section card">
						<div className="card-body text-center">
							<h2 className="mb-3 hero-title">Ready to Start Your Journey?</h2>
							<p className="hero-subtitle mb-4">Join other miniature enthusiasts and start tracking your progress today.</p>
							<div className="d-flex justify-content-center gap-3">
								<a href="/register" className="btn btn-hero">Get Started Now</a>
								<a href="/login" className="btn btn-hero-outline">Sign In</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;

	return (
		<div className="container-fluid py-4">
			<h1 className="mb-4 fw-bold text-white">Dashboard</h1>
			<div className="row justify-content-center mb-4">
				<div className="col-lg-6 col-md-8">
					<div className="card shadow-sm mb-4">
						<div className="card-body">
							<h4 className="card-title mb-3">Can't Decide What to Paint?</h4>
							<RandomMiniPicker jwt={accountInfo.jwt} />
						</div>
					</div>
				</div>
			</div>
			<div className="row g-4">
				<div className="col-md-6">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h3 className="card-title">Total Miniatures: {miniStats?.totalMiniatures ?? "..."}</h3>
							{miniStats?.miniaturesByState && (
								<PieChart
									data={{
										labels: Object.keys(miniStats.miniaturesByState),
										values: Object.values(miniStats.miniaturesByState)
									}}
									title="By State"
								/>
							)}
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card shadow-sm h-100 mb-4">
						<div className="card-body">
							<h3 className="card-title">Total Paints: {paintStats?.totalPaints ?? "..."}</h3>
							{paintStats?.paintsByBrand && (
								<PieChart
									data={{
										labels: Object.keys(paintStats.paintsByBrand),
										values: Object.values(paintStats.paintsByBrand)
									}}
									title="By Brand"
								/>
							)}
							{paintStats?.paintsByType && (
								<PieChart
									data={{
										labels: Object.keys(paintStats.paintsByType),
										values: Object.values(paintStats.paintsByType)
									}}
									title="By Type"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
