import React from 'react';
import Head from 'next/head';

export default function MetaTags() {
    return (
        <Head>
            <title>TimeOff</title>
            <meta name="description" content="Manage your leave days efficiently with TimeOff" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/timeoff-nobg.ico" />
        </Head>
    );
};
