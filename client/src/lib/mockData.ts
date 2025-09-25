// TODO: remove mock functionality - this is for design prototype only
export const mockEvents = [
  {
    id: "1",
    title: "Blockchain Summit 2024",
    description: "The premier event for Web3 innovation and decentralized technology",
    artistName: "Ethereum Foundation",
    venue: "Convention Center, San Francisco",
    eventDate: "2024-12-15T19:00:00Z",
    ticketPrice: 150,
    maxTickets: 1000,
    soldTickets: 750,
    imageUrl: "https://picsum.photos/400/200?random=1",
    contractAddress: "0x123...abc",
    isVerified: true,
  },
  {
    id: "2", 
    title: "DeFi Conference",
    description: "Learn about the future of decentralized finance",
    artistName: "DeFi Alliance",
    venue: "Tech Hub, Austin",
    eventDate: "2024-12-20T18:00:00Z",
    ticketPrice: 99,
    maxTickets: 500,
    soldTickets: 425,
    imageUrl: "https://picsum.photos/400/200?random=2",
    contractAddress: "0x456...def",
    isVerified: true,
  },
  {
    id: "3",
    title: "NFT Art Gallery Opening",
    description: "Exclusive digital art exhibition featuring top creators",
    artistName: "CryptoArtists Collective",
    venue: "Digital Gallery, New York",
    eventDate: "2024-12-25T20:00:00Z",
    ticketPrice: 75,
    maxTickets: 300,
    soldTickets: 180,
    imageUrl: "https://picsum.photos/400/200?random=3",
    contractAddress: "0x789...ghi",
    isVerified: false,
  }
];

export const mockUser = {
  id: "user1",
  walletAddress: "0x1234567890abcdef",
  mocaId: "moca_12345",
  username: "CryptoFan2024",
  reputationScore: 850,
  verifiedFan: true,
  createdAt: "2024-01-15T10:30:00Z",
};

export const mockCredentials = [
  {
    id: "cred1",
    userId: "user1",
    artistName: "Ethereum Foundation",
    credentialType: "early_supporter",
    credentialData: JSON.stringify({
      supportLevel: "Diamond",
      yearsSupporting: 3,
      eventsAttended: 12
    }),
    issuedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "cred2", 
    userId: "user1",
    artistName: "DeFi Alliance",
    credentialType: "attendance",
    credentialData: JSON.stringify({
      eventName: "DeFi Summit 2023",
      attendanceRate: 95,
      networkingScore: 88
    }),
    issuedAt: "2024-06-15T16:30:00Z",
  }
];

export const mockTickets = [
  {
    id: "ticket1",
    eventId: "1", 
    ownerId: "user1",
    tokenId: "NFT_001",
    purchasePrice: 150,
    isUsed: false,
    purchasedAt: "2024-11-01T12:00:00Z",
  },
  {
    id: "ticket2",
    eventId: "2",
    ownerId: "user1", 
    tokenId: "NFT_002",
    purchasePrice: 99,
    isUsed: true,
    purchasedAt: "2024-10-15T09:30:00Z",
  }
];