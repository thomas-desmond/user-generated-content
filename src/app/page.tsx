'use client';

import { UploadDemo } from './components/UploadDemo';
import { UGCContext } from './components/UGCContext';
import { DemoGuidance } from './components/DemoGuidance';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50/10 via-white to-orange-50/15 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20">
			<ThemeToggle />
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-4 mb-4">
						<div className="w-12 h-12 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded-xl flex items-center justify-center shadow-lg">
							<span className="text-white font-bold text-xl">CF</span>
						</div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-[#F6821F] to-[#FF6633] bg-clip-text text-transparent">
							User-Generated Content Infrastructure
						</h1>
					</div>
					<p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
						Scalable, cost-efficient content management with <span className="text-[#F6821F] font-semibold">Cloudflare R2</span>
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
						Modern applications are increasingly shaped by user-created content. This demo showcases 
						secure, scalable infrastructure for handling images, videos, documents, and more with zero egress fees.
					</p>
				</div>
				
				<UploadDemo />
				<UGCContext />
			</div>
			<DemoGuidance />
		</div>
	);
}
