import { useEffect, useState } from 'react';

function EmailReports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/unsubscribe');
                const data = await res.json();
                console.log(data)

                if (Array.isArray(data)) {
                    setReports(data);
                } else {
                    console.error('Bounce reports data is not an array:', data);
                    setReports([]);
                }
            } catch (error) {
                console.error('Error fetching bounce reports:', error);
                setReports([]);
            }
        };

        fetchReports();
    }, []);

    return (
        <div>
            <h1>Reports</h1>
            <br />
            <ul>
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <li key={index}>
                            <strong>Email:</strong> {report.email}<br/>
                            <strong>Reported at:</strong> 
                            {report.created 
                                ? new Date(report.created * 1000).toLocaleString() 
                                : 'Unknown'}
                            <br/><br/>
                        </li>
                    ))
                ) : (
                    <li>No data found</li>
                )}
            </ul>
        </div>
    );
}

export default EmailReports;
