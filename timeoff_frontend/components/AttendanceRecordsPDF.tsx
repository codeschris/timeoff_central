/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20 },
    title: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
    tableHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
    row: { flexDirection: 'row', borderBottom: '1px solid #ccc', padding: 5 },
    column: { flex: 1, fontSize: 10 },
});

const AttendanceReportsPDF = ({ logs, employeeName }: { logs: any[], employeeName: string }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>ATTENDANCE LOGS FOR {employeeName}</Text>
            <View style={styles.row}>
                <Text style={[styles.column, styles.tableHeader]}>Date</Text>
                <Text style={[styles.column, styles.tableHeader]}>Clock In</Text>
                <Text style={[styles.column, styles.tableHeader]}>Clock Out</Text>
            </View>
            {logs.map((log) => (
                <View key={log.id} style={styles.row}>
                    <Text style={styles.column}>{log.date}</Text>
                    <Text style={styles.column}>{log.clock_in}</Text>
                    <Text style={styles.column}>{log.clock_out}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default AttendanceReportsPDF;
