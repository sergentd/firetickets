/**
 * Mock data for development mode
 * Use this when VITE_DEV_MODE=true to bypass Firebase authentication
 */

export const mockUser = {
  uid: "dev-user-123",
  email: "dev@localhost.com",
  displayName: "Dev User",
};

export const mockTickets = [
  {
    id: "ticket-1",
    title: "Rappeler M. Dupont pour devis",
    customer: "M. Dupont",
    description: "Client intéressé par notre offre premium. A demandé un devis détaillé pour un projet de refonte complète de son site web.",
    priority: "high",
    type: "callback",
    status: "todo",
    userId: "dev-user-123",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    attachments: [
      {
        id: "att-1",
        name: "devis-dupont.pdf",
        type: "application/pdf",
        size: 245680,
        url: "https://example.com/devis.pdf",
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "att-2",
        name: "logo-entreprise.png",
        type: "image/png",
        size: 89432,
        url: "https://via.placeholder.com/400x300.png?text=Logo+Entreprise",
        uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    comments: [
      {
        id: "com-1",
        text: "Client très motivé, à relancer rapidement !",
        userEmail: "dev@localhost.com",
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 min ago
      },
      {
        id: "com-2",
        text: "Budget confirmé : 15 000€",
        userEmail: "dev@localhost.com",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
      },
    ],
    activities: [
      {
        id: "act-1",
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-2",
        type: "comment_added",
        description: "Commentaire ajouté par dev@localhost.com",
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: "act-3",
        type: "attachment_added",
        description: "Document ajouté : devis-dupont.pdf",
        timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
      },
      {
        id: "act-4",
        type: "priority_changed",
        description: "Priorité changée de Moyenne à Haute",
        timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
      },
      {
        id: "act-5",
        type: "comment_added",
        description: "Commentaire ajouté par dev@localhost.com",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ticket-2",
    title: "Préparer présentation client",
    customer: "Mme Martin",
    description: "Rendez-vous prévu demain à 14h. Préparer slides + démo produit.",
    priority: "urgent",
    type: "task",
    status: "in-progress",
    userId: "dev-user-123",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    comments: [],
    activities: [
      {
        id: "act-6",
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-7",
        type: "status_changed",
        description: "Statut changé de À faire à En cours",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ticket-3",
    title: "Répondre email Mme Leblanc",
    customer: "Mme Leblanc",
    description: "Question technique sur l'intégration API. Besoin de clarifications sur les endpoints REST.",
    priority: "medium",
    type: "task",
    status: "waiting",
    userId: "dev-user-123",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    dueDate: null,
    attachments: [],
    comments: [
      {
        id: "com-3",
        text: "En attente de réponse technique de l'équipe dev",
        userEmail: "dev@localhost.com",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    activities: [
      {
        id: "act-8",
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-9",
        type: "status_changed",
        description: "Statut changé de En cours à En attente",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-10",
        type: "comment_added",
        description: "Commentaire ajouté par dev@localhost.com",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ticket-4",
    title: "Audit SEO site web",
    customer: "M. Bernard",
    description: "Analyser les performances SEO actuelles et proposer des améliorations.",
    priority: "low",
    type: "task",
    status: "completed",
    userId: "dev-user-123",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [
      {
        id: "att-3",
        name: "rapport-seo.pdf",
        type: "application/pdf",
        size: 512000,
        url: "https://example.com/rapport-seo.pdf",
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    comments: [],
    activities: [
      {
        id: "act-11",
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-12",
        type: "status_changed",
        description: "Statut changé de À faire à En cours",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-13",
        type: "attachment_added",
        description: "Document ajouté : rapport-seo.pdf",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act-14",
        type: "status_changed",
        description: "Statut changé de En cours à Terminé",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ticket-5",
    title: "Formation nouveau logiciel",
    customer: "Équipe interne",
    description: "Organiser une session de formation sur le nouveau CRM pour toute l'équipe commerciale.",
    priority: "medium",
    type: "task",
    status: "todo",
    userId: "dev-user-123",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    comments: [],
    activities: [
      {
        id: "act-15",
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// In-memory storage for development
let tickets = [...mockTickets];

// Observer pattern for mock subscriptions
let subscribers = [];

const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...tickets]));
};

export const getMockTickets = () => {
  return Promise.resolve([...tickets]);
};

export const createMockTicket = (ticketData) => {
  const newTicket = {
    id: `ticket-${Date.now()}`,
    ...ticketData,
    userId: mockUser.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    comments: [],
    activities: [
      {
        id: `act-${Date.now()}`,
        type: "ticket_created",
        description: "Ticket créé",
        timestamp: new Date().toISOString(),
      },
    ],
  };
  tickets.push(newTicket);

  // Notify all subscribers of the change
  notifySubscribers();

  return Promise.resolve(newTicket.id);
};

export const updateMockTicket = (id, updates) => {
  const index = tickets.findIndex((t) => t.id === id);
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Notify all subscribers of the change
    notifySubscribers();
  }
  return Promise.resolve();
};

export const deleteMockTicket = (id) => {
  tickets = tickets.filter((t) => t.id !== id);

  // Notify all subscribers of the change
  notifySubscribers();

  return Promise.resolve();
};

export const subscribeMockTickets = (callback) => {
  // Add callback to subscribers list
  subscribers.push(callback);

  // Immediately call callback with current tickets
  callback([...tickets]);

  // Return unsubscribe function that removes this callback
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
};

export const addMockComment = (ticketId, commentText) => {
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    const newComment = {
      id: `com-${Date.now()}`,
      text: commentText,
      userEmail: mockUser.email,
      createdAt: new Date().toISOString(),
    };

    tickets[index].comments = tickets[index].comments || [];
    tickets[index].comments.push(newComment);
    tickets[index].updatedAt = new Date().toISOString();

    // Notify all subscribers of the change
    notifySubscribers();

    return Promise.resolve(newComment);
  }
  return Promise.reject(new Error("Ticket not found"));
};

export const addMockActivity = (ticketId, activityType, description) => {
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    const newActivity = {
      id: `act-${Date.now()}`,
      type: activityType,
      description: description,
      timestamp: new Date().toISOString(),
    };

    tickets[index].activities = tickets[index].activities || [];
    tickets[index].activities.push(newActivity);

    // Notify all subscribers of the change
    notifySubscribers();

    return Promise.resolve(newActivity);
  }
  return Promise.reject(new Error("Ticket not found"));
};

export const addMockAttachment = (ticketId, attachment) => {
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    tickets[index].attachments = tickets[index].attachments || [];
    tickets[index].attachments.push(attachment);
    tickets[index].updatedAt = new Date().toISOString();

    // Notify all subscribers of the change
    notifySubscribers();

    return Promise.resolve(attachment);
  }
  return Promise.reject(new Error("Ticket not found"));
};

export const removeMockAttachment = (ticketId, attachmentId) => {
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    tickets[index].attachments = (tickets[index].attachments || []).filter(
      att => att.id !== attachmentId
    );
    tickets[index].updatedAt = new Date().toISOString();

    // Notify all subscribers of the change
    notifySubscribers();

    return Promise.resolve();
  }
  return Promise.reject(new Error("Ticket not found"));
};
