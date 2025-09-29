const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const router = express.Router();

// Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Search players with advanced filters
router.get('/players', async (req, res) => {
  try {
    const {
      query,
      position,
      nationality,
      minAge,
      maxAge,
      minHeight,
      maxHeight,
      skills,
      page = 1,
      limit = 10
    } = req.query;

    const mustConditions = [];
    const filterConditions = [];

    // Text search
    if (query) {
      mustConditions.push({
        multi_match: {
          query: query,
          fields: ['firstName', 'lastName', 'position', 'nationality'],
          fuzziness: 'AUTO'
        }
      });
    }

    // Exact match filters
    if (position) {
      filterConditions.push({ term: { position } });
    }
    if (nationality) {
      filterConditions.push({ term: { nationality } });
    }

    // Range filters
    if (minAge || maxAge) {
      const range = {};
      if (minAge) range.gte = parseInt(minAge);
      if (maxAge) range.lte = parseInt(maxAge);
      filterConditions.push({ range: { age: range } });
    }

    if (minHeight || maxHeight) {
      const range = {};
      if (minHeight) range.gte = parseInt(minHeight);
      if (maxHeight) range.lte = parseInt(maxHeight);
      filterConditions.push({ range: { height: range } });
    }

    // Skills filter
    if (skills) {
      const skillArray = skills.split(',');
      skillArray.forEach(skill => {
        mustConditions.push({
          exists: {
            field: `skills.${skill}`
          }
        });
      });
    }

    const searchQuery = {
      index: 'players',
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must: mustConditions,
            filter: filterConditions
          }
        },
        sort: [
          { _score: { order: 'desc' } },
          { createdAt: { order: 'desc' } }
        ]
      }
    };

    const result = await client.search(searchQuery);
    
    res.json({
      players: result.body.hits.hits.map(hit => hit._source),
      total: result.body.hits.total.value,
      page: parseInt(page),
      totalPages: Math.ceil(result.body.hits.total.value / limit)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Auto-complete endpoint
router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;
    
    const result = await client.search({
      index: 'players',
      body: {
        suggest: {
          player_suggest: {
            prefix: q,
            completion: {
              field: 'suggest',
              fuzzy: {
                fuzziness: 'AUTO'
              }
            }
          }
        }
      }
    });

    res.json(result.body.suggest.player_suggest[0].options);
  } catch (error) {
    res.status(500).json({ error: 'Suggestion failed' });
  }
});

module.exports = router;
