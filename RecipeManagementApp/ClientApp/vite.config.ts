import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { defineConfig } from 'vite';

const baseFolder =
	process.env.APPDATA !== undefined && process.env.APPDATA !== ''
		? `${process.env.APPDATA}/ASP.NET/https`
		: `${process.env.HOME}/.aspnet/https`;

const certificateName = process.env.npm_package_name;

const certFilePath = join(baseFolder, `${certificateName}.pem`);
const keyFilePath = join(baseFolder, `${certificateName}.key`);

const path = require('path');
const { env } = require('process');

console.log(`env.ASPNETCORE_HTTPS_PORT: ${env.ASPNETCORE_HTTPS_PORT}`);
console.log(`env.ASPNETCORE_ENVIRONMENT: ${env.ASPNETCORE_ENVIRONMENT}`);
console.log(`env.ASPNETCORE_URLS: ${env.ASPNETCORE_URLS}`);

const target = env.ASPNETCORE_HTTPS_PORT
	? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
	: env.ASPNETCORE_URLS
		? env.ASPNETCORE_URLS.split(';')[0]
		: 'http://localhost:18082';

const baseProxy = {
    target,
    secure: false,
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
	resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
        },
    },
    server: {
        https: {
            key: readFileSync(keyFilePath),
            cert: readFileSync(certFilePath),
        },
        port: 4378,
        strictPort: true,

        // these are the proxy routes that will be forwarded to your **BFF**
        proxy: {
            '/bff': baseProxy,
            '/signin-oidc': baseProxy,
            '/signout-callback-oidc': baseProxy,
            '/api': baseProxy,
        },
    },
});
