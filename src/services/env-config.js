export const api = {
	dev: '/api',
	test: `//${window.location.host}`,
	prod: `//${window.location.host}`
}[process.env.REACT_APP_ENV];
