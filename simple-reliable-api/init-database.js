const { sequelize } = require('./config/database');
const Player = require('./models/Player');

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (creates tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables synchronized.');

    // Insert sample data
    const samplePlayers = [
      {
        firstName: 'Lionel',
        lastName: 'Messi',
        position: 'Forward',
        age: 36,
        height: 170,
        weight: 72,
        nationality: 'Argentina',
        skills: { speed: 90, dribbling: 95, shooting: 92, passing: 91, vision: 94 },
        physical: { agility: 92, balance: 90, stamina: 85 },
        team: 'Inter Miami',
        value: 50000000,
        highlights: ['World Cup Winner', '7x Ballon d\'Or'],
        videoUrl: '/videos/messi.mp4',
        talentScore: 82,
        potential: 71
      },
      {
        firstName: 'Virgil',
        lastName: 'Van Dijk',
        position: 'Defender',
        age: 32,
        height: 193,
        weight: 92,
        nationality: 'Netherlands',
        skills: { strength: 90, tackling: 88, heading: 85, positioning: 89, passing: 82 },
        physical: { agility: 75, balance: 85, stamina: 87 },
        team: 'Liverpool',
        value: 35000000,
        highlights: ['UEFA Champion', 'PFA Player of the Year'],
        videoUrl: '/videos/vandijk.mp4',
        talentScore: 77,
        potential: 70
      },
      {
        firstName: 'Kevin',
        lastName: 'De Bruyne',
        position: 'Midfielder',
        age: 32,
        height: 181,
        weight: 68,
        nationality: 'Belgium',
        skills: { passing: 94, vision: 95, shooting: 87, dribbling: 88, crossing: 93 },
        physical: { agility: 86, balance: 84, stamina: 89 },
        team: 'Manchester City',
        value: 60000000,
        highlights: ['Premier League Champion', 'UEFA Best Midfielder'],
        videoUrl: '/videos/debruyne.mp4',
        talentScore: 80,
        potential: 73
      },
      {
        firstName: 'Kylian',
        lastName: 'Mbappé',
        position: 'Forward',
        age: 25,
        height: 178,
        weight: 73,
        nationality: 'France',
        skills: { speed: 95, dribbling: 89, shooting: 88, passing: 80, finishing: 90 },
        physical: { agility: 93, balance: 88, stamina: 90 },
        team: 'Paris Saint-Germain',
        value: 180000000,
        highlights: ['World Cup Winner', 'Youngest Ballon d\'Or Nominee'],
        videoUrl: '/videos/mbappe.mp4',
        talentScore: 98,
        potential: 98
      },
      {
        firstName: 'Erling',
        lastName: 'Haaland',
        position: 'Forward',
        age: 23,
        height: 194,
        weight: 88,
        nationality: 'Norway',
        skills: { shooting: 94, strength: 89, heading: 85, positioning: 90, finishing: 95 },
        physical: { agility: 80, balance: 85, stamina: 88 },
        team: 'Manchester City',
        value: 170000000,
        highlights: ['Premier League Record', 'Champions League Top Scorer'],
        videoUrl: '/videos/haaland.mp4',
        talentScore: 97,
        potential: 99
      }
    ];

    await Player.bulkCreate(samplePlayers);
    console.log('✅ Sample player data inserted successfully.');
    
    const playerCount = await Player.count();
    console.log(`📊 Total players in database: ${playerCount}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

initializeDatabase();
