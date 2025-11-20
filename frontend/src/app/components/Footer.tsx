'use client';

import { Github } from 'lucide-react';

export function Footer() {
	return (
		<footer className="bg-white border-t border-gray-200 mt-16">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
					{/* Powered by Cloudflare */}
					<div className="flex items-center space-x-2">
						<span className="text-gray-600">Powered by</span>
						<div className="flex items-center space-x-2">
							<div className="w-6 h-6 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded flex items-center justify-center">
								<span className="text-white font-bold text-xs">CF</span>
							</div>
							<span className="font-semibold bg-gradient-to-r from-[#F6821F] to-[#FF6633] bg-clip-text text-transparent">
								Cloudflare
							</span>
						</div>
					</div>

					{/* GitHub Link */}
					<div className="flex items-center space-x-4">
						<a
							href="https://github.com/your-username/your-repo" // Replace with your actual GitHub repo URL
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
						>
							<Github size={20} />
							<span>View on GitHub</span>
						</a>
					</div>
				</div>

				{/* Copyright or additional info */}
				<div className="mt-6 pt-6 border-t border-gray-100 text-center">
					<p className="text-sm text-gray-500">
						Demo showcasing scalable user-generated content management with Cloudflare R2
					</p>
				</div>
			</div>
		</footer>
	);
}
