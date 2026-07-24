async function main() {
  const url = "https://docs.google.com/spreadsheets/d/1RCZOYIMNUcsdM7pSupeMt4v_NhOccIohjzuXzNg4BIU/edit?usp=sharing";
  const res = await fetch(url);
  const html = await res.text();

  // Find sheet names in JSON structures
  const regex = /\[(\d+),\s*"([^"]+)"/g;
  let match;
  console.log("Found matches:");
  while ((match = regex.exec(html)) !== null) {
    if (match[2].length < 30 && !match[2].includes('\\')) {
      console.log(`Gid: ${match[1]} -> Name: ${match[2]}`);
    }
  }
}

main().catch(console.error);
