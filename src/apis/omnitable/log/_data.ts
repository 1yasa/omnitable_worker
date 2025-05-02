export default [
	{
		status: 200,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v1/users/123',
		latency: 85,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/products/category/electronics',
		latency: 150,
		region_short: 'eu-west-1',
		region_full: 'EU (Ireland)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'cdn.example.org',
		pathname: '/images/logo.png',
		latency: 35,
		region_short: 'ap-southeast-1',
		region_full: 'Asia Pacific (Singapore)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v1/orders',
		latency: 110,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/',
		latency: 95,
		region_short: 'eu-central-1',
		region_full: 'EU (Frankfurt)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v1/health',
		latency: 25,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'cdn.example.org',
		pathname: '/assets/main.css',
		latency: 40,
		region_short: 'ap-northeast-1',
		region_full: 'Asia Pacific (Tokyo)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/search?q=drizzle',
		latency: 210,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'service.internal',
		pathname: '/status',
		latency: 15,
		region_short: 'sa-east-1',
		region_full: 'South America (São Paulo)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v2/items/query',
		latency: 130,
		region_short: 'eu-west-1',
		region_full: 'EU (Ireland)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v1/users',
		latency: 180,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'auth.example.com',
		pathname: '/login',
		latency: 250,
		region_short: 'eu-central-1',
		region_full: 'EU (Frankfurt)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v1/orders/456/items',
		latency: 220,
		region_short: 'ap-southeast-1',
		region_full: 'Asia Pacific (Singapore)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'www.example.com',
		pathname: '/contact',
		latency: 190,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v1/events',
		latency: 75,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 404,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/nonexistent/page',
		latency: 65,
		region_short: 'eu-west-1',
		region_full: 'EU (Ireland)'
	},
	{
		status: 404,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v1/users/9999',
		latency: 90,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 400,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v1/users',
		latency: 115,
		region_short: 'ap-northeast-1',
		region_full: 'Asia Pacific (Tokyo)'
	},
	{
		status: 404,
		method: 'GET',
		host: 'cdn.example.org',
		pathname: '/images/old_logo.jpeg',
		latency: 50,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 400,
		method: 'POST',
		host: 'auth.example.com',
		pathname: '/register',
		latency: 280,
		region_short: 'eu-central-1',
		region_full: 'EU (Frankfurt)'
	},
	{
		status: 404,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/blog/post-that-was-deleted',
		latency: 105,
		region_short: 'sa-east-1',
		region_full: 'South America (São Paulo)'
	},
	{
		status: 500,
		method: 'GET',
		host: 'api.example.com',
		pathname: '/v1/complex_report',
		latency: 1500,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 503,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v1/orders',
		latency: 2500,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 500,
		method: 'GET',
		host: 'www.example.com',
		pathname: '/products/special',
		latency: 850,
		region_short: 'eu-central-1',
		region_full: 'EU (Frankfurt)'
	},
	{
		status: 503,
		method: 'GET',
		host: 'service.internal',
		pathname: '/heavy-task',
		latency: 3000,
		region_short: 'ap-southeast-1',
		region_full: 'Asia Pacific (Singapore)'
	},
	{
		status: 500,
		method: 'POST',
		host: 'auth.example.com',
		pathname: '/login',
		latency: 1200,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'metrics.example.internal',
		pathname: '/prometheus',
		latency: 45,
		region_short: 'eu-west-1',
		region_full: 'EU (Ireland)'
	},
	{
		status: 200,
		method: 'POST',
		host: 'api.example.com',
		pathname: '/v2/graphql',
		latency: 310,
		region_short: 'us-west-2',
		region_full: 'US West (Oregon)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'docs.example.dev',
		pathname: '/introduction',
		latency: 110,
		region_short: 'ap-northeast-1',
		region_full: 'Asia Pacific (Tokyo)'
	},
	{
		status: 200,
		method: 'GET',
		host: 'status.example.com',
		pathname: '/api/v1/components',
		latency: 60,
		region_short: 'us-east-1',
		region_full: 'US East (N. Virginia)'
	}
]
