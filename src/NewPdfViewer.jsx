import * as React from 'react';

export default function NewPdfViewer() {
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const container = containerRef.current;
        let PSPDFKit;
        const licenseKey = getLicenseKey(); // Please use license key from your side
        let basePath;
        if (`${window.location.protocol}//${window.location.host}`.startsWith('http://localhost')) {
            basePath = `${window.location.protocol}//${window.location.host}${process.env.PUBLIC_URL}`;
        } else {
            basePath = `${window.location.protocol}//${window.location.host}${process.env.PUBLIC_URL}/static/`;
        }
        (async function () {
            PSPDFKit = await import("pspdfkit");
            const instance = await PSPDFKit.load({
                container,
                document: 'dumme.pdf',
                licenseKey,
                baseUrl: basePath
            });
            // Please comment / uncomment to check annotations flip-floping.
            // Without applyOperations, annotations are appearing without any issue
            // With applyOperations, annotations appear randomly in few pages and disappearing in few other pages

            instance.applyOperations([
                {
                    type: 'keepPages',
                    pageIndexes: [0, 1, 2]
                }
            ]);
        })();

        return () => PSPDFKit & PSPDFKit.unload(container);
    });

    return <div ref={containerRef} style={{ width: '100%', height: '100vh'}} />
}