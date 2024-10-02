import { useEffect, useState } from 'react';

function EmailReports() {
    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState('invalid'); // Default to 'invalid'

    const fetchReports = async (type) => {
        try {
            const res = await fetch(`/api/${type}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setReports(data);
            } else {
                console.error(`${type} reports data is not an array:`, data);
                setReports([]);
            }
        } catch (error) {
            console.error(`Error fetching ${type} reports:`, error);
            setReports([]);
        }
    };

    // Fetch reports based on the current reportType when the component mounts or reportType changes
    useEffect(() => {
        fetchReports(reportType);
    }, [reportType]);

    return (
        <div>
            <h1>Email Reports</h1>
            <div>
                {/* Buttons to choose report type */}
                <button onClick={() => setReportType('blocks')}>Blocks</button>
                <button onClick={() => setReportType('bounce')}>Bounces</button>
                <button onClick={() => setReportType('invalid')}>Invalid</button>
                <button onClick={() => setReportType('spam')}>Spam</button>
            </div>
            <br />
            <h2>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Reports</h2>
            <ul>
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <li key={index}>
                            <strong>Email:</strong> {report.email}<br />
                            <strong>Reported at:</strong>{' '}
                            {report.created
                                ? new Date(report.created * 1000).toLocaleString()
                                : 'Unknown'}
                            <br /><br />
                        </li>
                    ))
                ) : (
                    <li>No {reportType} reports available</li>
                )}
            </ul>
        </div>
    );
}

export default EmailReports;
