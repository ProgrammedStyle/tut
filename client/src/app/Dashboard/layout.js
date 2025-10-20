// Force dynamic rendering for all Dashboard pages (protected routes with useSearchParams)
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}
