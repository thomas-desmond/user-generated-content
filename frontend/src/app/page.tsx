'use client';

import { UploadDemo } from './components/UploadDemo';
import { UGCContext } from './components/UGCContext';
import { CloudflareProductsShowcase } from './components/CloudflareProductsShowcase';
import { Footer } from './components/Footer';
import { JoinDemo } from './components/JoinDemo';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
			{/* Desktop-only QR code for presentations */}
			<JoinDemo />
			
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-4 mb-4">
						<img 
							src="/cloudflare-logo.png" 
							alt="Cloudflare Logo" 
							className="w-12 h-12"
						/>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-[#F6821F] to-[#FF6633] bg-clip-text text-transparent">
							User-Generated Content
						</h1>
					</div>
					<p className="text-lg text-gray-600 mb-2">
						Scalable, cost-efficient content management with <span className="font-semibold border-b-2 border-orange-500">Cloudflare R2</span>
					</p>
					<p className="text-sm text-gray-500 max-w-2xl mx-auto">
						Modern applications are increasingly shaped by user-created content. This demo showcases a complete event-driven pipeline for handling uploads, processing, and AI analysis on a single integrated platform.
					</p>
				</div>
				
				<UploadDemo />
				<CloudflareProductsShowcase />
				<UGCContext />
			</div>
			<Footer />
		</div>
	);
}
