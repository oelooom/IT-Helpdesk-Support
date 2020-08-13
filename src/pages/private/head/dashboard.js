import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

function PaymentConfirmation() {
    const [isLoading, setIsLoading] = useState(true);

    const handleMessage = (event) => {
        if (event.data.action === 'receipt-loaded') {
            setIsLoading(false);
        }
    };

    const printIframe = (id) => {
        const iframe = document.frames
            ? document.frames[id]
            : document.getElementById(id);
        const iframeWindow = iframe.contentWindow || iframe;

        iframe.focus();
        iframeWindow.print();

        return false;
    };

    useEffect(() => {
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <>
            <iframe
                id="receipt"
                src="/head/report"
                style={{ display: 'none' }}
                title="Receipt"
            />
            <Button variant='contained' color='primary' onClick={() => printIframe('receipt')}>
                {isLoading ? 'Print Ticket Report' : 'Print Ticket Report'}
            </Button>
        </>
    );
}

export default PaymentConfirmation;