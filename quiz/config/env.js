let baseUrl = '';

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://a02.com'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = '';
}

export { baseUrl }