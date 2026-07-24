import fs from 'fs';

async function parseSheet() {
  const url = "https://docs.google.com/spreadsheets/d/1RCZOYIMNUcsdM7pSupeMt4v_NhOccIohjzuXzNg4BIU/export?format=csv";
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.split("\n").map(r => r.split(","));

  console.log("Total rows:", rows.length);

  // Line 0: Channels
  // Line 1: Departments
  // Line 2: Header (Topic, etc.) & Row 1 topics
  const depts = [
    { id: 'ai-earning-ltd', name: 'AI Earining Ltd', channel: 'AI Earining Ltd', topicCol: 2, dateCol: 3, statusCol: 4 },
    { id: 'sonali-insurance', name: 'Sonali Insurance', channel: 'Pesha dari', topicCol: 5, dateCol: 6, statusCol: 7 },
    { id: 'product-review', name: 'Product Review', channel: 'Pesha dari', topicCol: 8, dateCol: 9, statusCol: 10 },
    { id: 'drpshop', name: 'DRPSHOP', channel: 'Hiden', topicCol: 11, dateCol: 12, statusCol: 13 },
    { id: 'job-news', name: 'Job News', channel: 'Job News', topicCol: 14, dateCol: 15, statusCol: 16 }
  ];

  const parsedDepartments = depts.map(d => {
    const topics = [];
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;
      const topicText = row[d.topicCol]?.trim();
      const dateText = row[d.dateCol]?.trim();
      const statusText = row[d.statusCol]?.trim();

      if (topicText || dateText) {
        topics.push({
          id: `${d.id}-task-${r}`,
          topic: topicText || 'N/A',
          scheduledDate: dateText || 'N/A',
          isCompleted: statusText?.toUpperCase() === 'TRUE',
          status: statusText?.toUpperCase() === 'TRUE' ? 'Completed' : 'Pending'
        });
      }
    }
    return {
      ...d,
      topics
    };
  });

  console.log("PARSED DEPARTMENTS:", JSON.stringify(parsedDepartments, null, 2));
}

parseSheet().catch(console.error);
