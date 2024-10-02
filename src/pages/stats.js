import { useState, useEffect } from 'react';

export default function EmailEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmailEvents = async () => {
            try {
                const response = await fetch('/api/email-events');
                if (!response.ok) {
                    throw new Error('Error fetching email events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmailEvents();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Email Events</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Event Type</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td>{event.email}</td>
                            <td>{event.event_type}</td>
                            <td>{new Date(event.timestamp * 1000).toLocaleString()}</td> {/* Convert UNIX timestamp */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
