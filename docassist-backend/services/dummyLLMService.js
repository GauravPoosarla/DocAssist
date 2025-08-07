async function classifyTicket(ticket) {
  const isBug = ticket.title.toLowerCase().includes('crash') ||
                ticket.description.toLowerCase().includes('exception') ||
                ticket.title.toLowerCase().includes('fix');

  return {
    type: isBug ? "Bug" : "Enhancement",
    summary: isBug
      ? "Resolved a bug affecting system behavior."
      : "Introduced a new enhancement to improve functionality.",
    doc_suggestion: isBug
      ? "Update 'Known Issues' section to reflect the fix."
      : "Update 'Feature Overview' with new capability.",
    keywords: ticket.title.split(" ").slice(0, 3)
  };
}

module.exports = { classifyTicket };
