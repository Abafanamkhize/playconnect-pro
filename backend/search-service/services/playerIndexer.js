const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

class PlayerIndexer {
  async indexPlayer(player) {
    try {
      await client.index({
        index: 'players',
        id: player.id,
        body: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          position: player.position,
          nationality: player.nationality,
          height: player.height,
          weight: player.weight,
          skills: player.skills,
          verificationStatus: player.verificationStatus,
          age: this.calculateAge(player.dateOfBirth),
          suggest: {
            input: [
              player.firstName,
              player.lastName,
              `${player.firstName} ${player.lastName}`,
              player.position,
              player.nationality
            ],
            weight: 1
          },
          createdAt: player.createdAt,
          updatedAt: player.updatedAt
        }
      });
      
      console.log(`Indexed player: ${player.firstName} ${player.lastName}`);
    } catch (error) {
      console.error('Indexing error:', error);
    }
  }

  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  async createIndex() {
    try {
      await client.indices.create({
        index: 'players',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              firstName: { type: 'text' },
              lastName: { type: 'text' },
              position: { type: 'keyword' },
              nationality: { type: 'keyword' },
              height: { type: 'float' },
              weight: { type: 'float' },
              skills: { type: 'object' },
              verificationStatus: { type: 'keyword' },
              age: { type: 'integer' },
              suggest: { type: 'completion' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });
      console.log('Players index created');
    } catch (error) {
      if (error.body?.error?.type !== 'resource_already_exists_exception') {
        console.error('Index creation error:', error);
      }
    }
  }
}

module.exports = PlayerIndexer;
