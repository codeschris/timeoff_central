/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    tableHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
    row: { flexDirection: 'row', borderBottom: '1px solid #ccc', padding: 5 },
    column: { flex: 1, fontSize: 10 },
});

const LeaveLogsPDF = ({ logs, employeeName }: { logs: any[], employeeName: string }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>Leave Logs for {employeeName}</Text>
            <View style={styles.row}>
                <Text style={[styles.column, styles.tableHeader]}>#</Text>
                <Text style={[styles.column, styles.tableHeader]}>Start Date</Text>
                <Text style={[styles.column, styles.tableHeader]}>End Date</Text>
                <Text style={[styles.column, styles.tableHeader]}>Days Requested</Text>
                <Text style={[styles.column, styles.tableHeader]}>Purpose</Text>
            </View>
            {logs.map((log, index) => (
                <View key={log.id} style={styles.row}>
                    <Text style={styles.column}>{index + 1}</Text>
                    <Text style={styles.column}>{log.start_date}</Text>
                    <Text style={styles.column}>{log.end_date}</Text>
                    <Text style={styles.column}>{log.days_requested}</Text>
                    <Text style={styles.column}>{log.purpose}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default LeaveLogsPDF;
