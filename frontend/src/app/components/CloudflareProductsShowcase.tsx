'use client';

import Image from 'next/image';
import Link from 'next/link';

export function CloudflareProductsShowcase() {
	const products = [
		{ name: 'Workers', icon: '/workers.png', url: 'https://workers.cloudflare.com/product/workers' },
		{ name: 'R2', icon: '/r2.png', url: 'https://workers.cloudflare.com/product/r2' },
		{ name: 'D1', icon: '/d1.png', url: 'https://workers.cloudflare.com/product/d1' },
		{ name: 'Queues', icon: '/queues.png', url: 'https://workers.cloudflare.com/product/queues' },
		{ name: 'Workflows', icon: '/workflows.png', url: 'https://workers.cloudflare.com/product/workflows' },
		{ name: 'Workers AI', icon: '/workers-ai.png', url: 'https://workers.cloudflare.com/product/workers-ai' }
	];

	return (
		<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-8">
			<div className="text-center mb-6">
				<h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 inline-block pb-1 mb-2">
					Powered by Cloudflare
				</h2>
				<p className="text-gray-600 text-sm">
					Built with multiple Cloudflare products for a complete solution
				</p>
			</div>
			
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{products.map((product) => (
					<Link
						key={product.name}
						href={product.url}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex flex-col items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 hover:shadow-md border border-gray-200 cursor-pointer"
					>
						<div className="w-[120px] h-[75px] bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
							<Image
								src={product.icon}
								alt={`${product.name} icon`}
								width={120}
								height={75}
								className="group-hover:scale-103 transition-transform duration-200"
							/>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
