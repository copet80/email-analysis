import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#845EC2',
  '#D65DB1',
  '#FF6F91',
  '#FF9671',
  '#FFC75F',
  '#F9F871',
  '#2C73D2',
  '#008E9B',
  '#008F7A',
];

// const chartData = [
//   { month: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { month: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   { month: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//   { month: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//   { month: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//   { month: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//   { month: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
// ];

export default function RelationshipsChart(props) {
  const { data, email } = props;
  const emailLC = email.toLowerCase();

  const emails = {};
  const chartMap = {};
  const chartData = [];

  const interactions = Object.keys(data || {})
    .filter((k) => {
      const entry = data[k];
      return entry.node1.key !== emailLC || entry.node2.key !== emailLC;
    })
    .map((k) => {
      const entry = data[k];
      return entry.node1.key === emailLC ? entry.node2 : entry.node1;
    })
    .sort((a, b) => {
      return b.interactionCount - a.interactionCount;
    })
    .splice(0, COLORS.length);

  let minDate = null;
  let maxDate = null;
  interactions.forEach((interaction) => {
    interaction.messages.forEach((message) => {
      if (minDate === null || message.sentAt.isBefore(minDate)) {
        minDate = message.sentAt;
      }
      if (maxDate === null || message.sentAt.isAfter(maxDate)) {
        maxDate = message.sentAt;
      }
    });
    emails[interaction.key] = 0;
  });

  if (minDate) {
    let month = minDate.clone();
    month = month.startOf('month');
    while (month.isBefore(maxDate)) {
      const chartItem = {
        month: month.format('MMM YY'),
        ...emails,
      };
      chartMap[chartItem.month] = chartItem;
      chartData.push(chartItem);
      month = month.add(1, 'month');
    }
  }

  interactions.forEach((interaction) => {
    interaction.messages.forEach((message) => {
      chartMap[message.sentAt.startOf('month').format('MMM YY')][
        interaction.key
      ]++;
    });
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {Object.keys(emails).map((email, index) => (
          <Line type="monotone" dataKey={email} stroke={COLORS[index]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
