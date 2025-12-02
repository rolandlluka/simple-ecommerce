export function Heading({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <h1 className="text-3xl font-bold tracking-tight mb-6">{children}</h1>
    );
}

export default Heading;
