import { Link } from 'react-router-dom'

const Error = () => {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-text mb-4">Page Not Found</h1>
            <p className="text-text/80">The page you're looking for doesn't exist.</p>
        </div>
    )
}

export default Error