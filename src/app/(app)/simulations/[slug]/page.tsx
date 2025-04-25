export default function Page({ params }: { params: { slug: string } }) {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold">Simulation: {params.slug}</h1>
            <p className="mt-2">This is a placeholder for the simulation page.</p>
        </div>
    )
}