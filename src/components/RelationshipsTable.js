import React from 'react';
import MaterialTable from 'material-table';
import { durationFormat } from '../utils/date';

export default function RelationshipsTable(props) {
  const { data, email } = props;
  const emailLC = email.toLowerCase();

  const tableData = Object.keys(data || {})
    .filter((k) => {
      const entry = data[k];
      return entry.node1.key !== emailLC || entry.node2.key !== emailLC;
    })
    .map((k) => {
      const entry = data[k];
      const node = entry.node1.key === emailLC ? entry.node2 : entry.node1;
      return {
        ...node,
        minInterval:
          node.minInterval !== null
            ? node.minInterval
            : Number.MAX_SAFE_INTEGER,
        maxInterval:
          node.maxInterval !== null
            ? node.maxInterval
            : Number.MAX_SAFE_INTEGER,
        avgInterval:
          node.avgInterval !== null
            ? node.avgInterval
            : Number.MAX_SAFE_INTEGER,
        minTTR: node.minTTR !== null ? node.minTTR : Number.MAX_SAFE_INTEGER,
        maxTTR: node.maxTTR !== null ? node.maxTTR : Number.MAX_SAFE_INTEGER,
        avgTTR: node.avgTTR !== null ? node.avgTTR : Number.MAX_SAFE_INTEGER,
      };
    });

  const renderInteraction = (fieldName) => (rowData) => {
    return (
      <React.Fragment>
        <span className="introduction">{rowData.introduction[fieldName]}</span>
        <span className="separator">{' / '}</span>
        <span className="general">{rowData[fieldName]}</span>
      </React.Fragment>
    );
  };

  const renderInterval = (fieldName) => (rowData) => {
    return durationFormat(rowData[fieldName]);
  };

  const renderMinMaxAvg = (fieldName) => (rowData) => {
    const min = durationFormat(rowData[`min${fieldName}`]);
    const max = durationFormat(rowData[`max${fieldName}`]);
    const avg = durationFormat(rowData[`avg${fieldName}`]);
    return `${avg} (${min} - ${max})`;
  };

  const tableColumns = [
    { title: 'Contact', field: 'email' },
    {
      title: 'Sent',
      field: 'sentCount',
      type: 'numeric',
      render: renderInteraction('sentCount'),
    },
    {
      title: 'Received',
      field: 'receivedCount',
      type: 'numeric',
      render: renderInteraction('receivedCount'),
    },
    {
      title: 'Total',
      field: 'interactionCount',
      type: 'numeric',
      render: renderInteraction('interactionCount'),
    },
    {
      title: 'Avg. TTR',
      field: 'avgTTR',
      type: 'numeric',
      render: renderInterval('avgTTR'),
    },
    {
      title: 'Avg. Interval',
      field: 'avgInterval',
      type: 'numeric',
      render: renderInterval('avgInterval'),
    },
  ];

  return (
    <MaterialTable
      title="Interactions"
      columns={tableColumns}
      data={tableData}
    />
  );
}
