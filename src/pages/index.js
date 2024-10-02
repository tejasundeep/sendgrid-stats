import { useEffect, useState } from 'react';

function SpamReports() {
    const [spamReports, setSpamReports] = useState([]);

    useEffect(() => {
        const fetchSpamReports = async () => {
            const res = await fetch('/api/bounce');
            const data = await res.json();
            setSpamReports(data);
        };

        fetchSpamReports();
    }, []);

    return (
        <div>
            <h1>Reports</h1>
            <ul>
                {spamReports.map((report) => (
                    <li key={report.email}>
                        <strong>Email:</strong> {report.email}<br/><strong>Reported at: </strong>
                        {new Date(report.created).toLocaleString()}<br /><br />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SpamReports;