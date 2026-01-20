const rawTickets = [
  {
    id: 101,
    title: "Login not working",
    category: "auth",
    priority: "high",
    createdBy: { id: 1, name: "Ali" },
    tags: ["login", "bug", "auth"],
  },
  {
    id: 102,
    title: "Payment page stuck",
    category: "payment",
    priority: "medium",
    createdBy: { id: 2, name: "Sara" },
    tags: ["payment", "ui"],
  },
  {
    id: 103,
    title: "Forgot password email not received",
    category: "auth",
    priority: "high",
    createdBy: { id: 1, name: "Ali" },
    tags: ["auth", "email"],
  },
  {
    id: 104,
    title: "App is slow",
    category: "performance",
    priority: "low",
    createdBy: { id: 3, name: "Ahmed" },
    tags: ["speed", "performance"],
  },
  {
    id: 105,
    title: "Payment failed error",
    category: "payment",
    priority: "high",
    createdBy: { id: 4, name: "Zain" },
    tags: ["payment", "bug"],
  },
  {
    id: 106,
    title: "Login not working",
    category: "auth",
    priority: "high",
    createdBy: { id: 1, name: "Ali" },
    tags: ["login", "bug", "auth"],
  },
  {
    id: 107,
    title: "Profile update issue",
    category: "profile",
    priority: "medium",
    tags: ["profile", "bug"],
  },
];

function formatTicketForUI(ticket) {
    const { id, title, category, priority, createdBy, tags = [] } = ticket;

    const createdByName = createdBy?.name ?? "Unknown";
    const createdById = createdBy?.id ?? 0;

    const tagCount = tags.length;
    const label = `[${priority.toUpperCase()}] ${title} — by ${createdByName}`;

    return {
        id,
        title,
        category,
        priority,
        createdByName,
        createdById,
        tagCount,
        label
    };
}

function createTicketCounter() {
    let count = 0;
    
    return function() {
        count++;
        return count;
    };
}

function analyzeTickets(rawTickets) {
    if (!Array.isArray(rawTickets)) {
        throw new Error("Invalid input: rawTickets must be an array");
    }

    console.log("Starting analysis...");
    console.table(rawTickets);

    const uiTickets = rawTickets.map(function(ticket) {
        return formatTicketForUI(ticket);
    });

    const duplicates = [];
    const seenTickets = new Set();

    uiTickets.forEach(function(ticket) {
        const duplicateKey = `${ticket.title}-${ticket.createdById}`;

        if (seenTickets.has(duplicateKey)) {
            duplicates.push(ticket.id);
        } else {
            seenTickets.add(duplicateKey);
        }
    });

    const ticketsByCategory = uiTickets.reduce(function(summary, ticket) {
        const category = ticket.category;
        
        summary[category] = (summary[category] ?? 0) + 1;
        
        return summary;
    }, {});

    const priorityCountMap = new Map();

    uiTickets.forEach(function(ticket) {
        const p = ticket.priority;
        const currentCount = priorityCountMap.get(p) ?? 0;
        priorityCountMap.set(p, currentCount + 1);
    });

    const ticketsByPriority = Object.fromEntries(priorityCountMap);

    const userCounts = uiTickets.reduce(function(acc, ticket) {
        const id = ticket.createdById;
        const name = ticket.createdByName;

        if (id === 0) return acc;

        acc[id] = acc[id] ?? { id, name, ticketCount: 0 };
        acc[id].ticketCount++;
        
        return acc;
    }, {});

    const topUser = Object.values(userCounts).reduce(function(prev, current) {
        return (prev.ticketCount > current.ticketCount) ? prev : current;
    });

    const tagStats = {};

    rawTickets.forEach(function(ticket) {
        const tags = ticket.tags ?? [];
        
        tags.forEach(function(tag) {
            tagStats[tag] = (tagStats[tag] ?? 0) + 1;
        });
    });

    const countTicket = createTicketCounter();
    let totalProcessed = 0;

    uiTickets.forEach(function(ticket) {
        countTicket();
        totalProcessed++;
    });

    return {
        summary: {
            totalTickets: rawTickets.length,
            totalProcessed: totalProcessed,
            ticketsByCategory: ticketsByCategory,
            ticketsByPriority: ticketsByPriority,
            topUser: topUser
        },
        uiTickets: uiTickets,
        duplicates: duplicates,
        tagStats: tagStats
    };
}

const result = analyzeTickets(rawTickets);
console.log("=== FINAL RESULT ===");
console.log(result);
