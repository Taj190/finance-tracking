import React from 'react';
import { Line, Pie } from '@ant-design/charts';
import "./style.css";

function ChartComponent({ sortedTransactions }) {
  // Data for Line chart
  const data = sortedTransactions.map((transaction) => ({
    date: transaction.date,
    amount: transaction.amount,
  }));

  // Data for Pie chart
  const spendingprops = sortedTransactions
    .filter(transaction => transaction.type === 'expense')
    .map(transaction => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  // Aggregate the spending data by tag
  const finalSpending = spendingprops.reduce((acc, obj) => {
    if (!acc[obj.tag]) {
      acc[obj.tag] = { tag: obj.tag, amount: 0 };
    }
    acc[obj.tag].amount += obj.amount;
    return acc;
  }, {});

  // Config for Line chart
  const lineConfig = {
    data,
    xField: 'date',
    yField: 'amount',
  };

  // Config for Pie chart
  const pieConfig = {
    data: Object.values(finalSpending),  // Pass the aggregated data
    angleField: 'amount',
    colorField: 'tag',
  };

  return (
    <div className='chart-wrapper'>
      <div className='line-chart'>
        <Line {...lineConfig} />
      </div>
      <div className='pie-chart'>
        <Pie className='pie' {...pieConfig} />
      </div>
    </div>
  );
}

export default ChartComponent;
