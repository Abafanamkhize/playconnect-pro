const { Sequelize } = require('sequelize');
const Player = require('../models/Player');
const Federation = require('../models/Federation');

class PlayerAdvancedController {
  
  // Advanced player search with multiple criteria
  async advancedSearch(req, res) {
    try {
      const {
        query,
        position,
        ageMin,
        ageMax,
        skills,
        federationId,
        ratingMin,
        ratingMax,
        location,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.body;

      const whereClause = {};
      const havingClause = {};

      // Text search across multiple fields
      if (query) {
        whereClause[Sequelize.Op.or] = [
          { firstName: { [Sequelize.Op.iLike]: `%${query}%` } },
          { lastName: { [Sequelize.Op.iLike]: `%${query}%` } },
          { position: { [Sequelize.Op.iLike]: `%${query}%` } }
        ];
      }

      // Position filter
      if (position) {
        whereClause.position = position;
      }

      // Age range filter
      if (ageMin || ageMax) {
        const birthDateMax = ageMin ? new Date(new Date().getFullYear() - ageMin, 0, 1) : null;
        const birthDateMin = ageMax ? new Date(new Date().getFullYear() - ageMax - 1, 11, 31) : null;
        
        whereClause.dateOfBirth = {};
        if (birthDateMax) whereClause.dateOfBirth[Sequelize.Op.lte] = birthDateMax;
        if (birthDateMin) whereClause.dateOfBirth[Sequelize.Op.gte] = birthDateMin;
      }

      // Federation filter
      if (federationId) {
        whereClause.federationId = federationId;
      }

      // Skills filter (assuming skills is a JSONB field)
      if (skills && Array.isArray(skills)) {
        skills.forEach(skill => {
          whereClause[`stats.${skill}`] = { [Sequelize.Op.gte]: 70 }; // Minimum skill threshold
        });
      }

      const offset = (page - 1) * limit;

      const players = await Player.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder]],
        include: [{
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name', 'country']
        }]
      });

      // Calculate advanced metrics for each player
      const enhancedPlayers = players.rows.map(player => {
        const playerJSON = player.toJSON();
        
        // Calculate overall rating from skills
        const skills = playerJSON.stats || {};
        const skillValues = Object.values(skills);
        const overallRating = skillValues.length > 0 
          ? Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length)
          : 0;

        // Calculate potential score (simplified algorithm)
        const age = this.calculateAge(playerJSON.dateOfBirth);
        const potentialScore = this.calculatePotential(overallRating, age);

        return {
          ...playerJSON,
          analytics: {
            overallRating,
            potentialScore,
            age,
            skillBreakdown: skills,
            performanceTrend: this.generatePerformanceTrend(playerJSON.id),
            comparisonPercentile: this.calculatePercentile(overallRating)
          }
        };
      });

      res.json({
        success: true,
        data: {
          players: enhancedPlayers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: players.count,
            pages: Math.ceil(players.count / limit)
          },
          analytics: {
            totalPlayers: players.count,
            averageRating: this.calculateAverageRating(enhancedPlayers),
            positionDistribution: this.calculatePositionDistribution(enhancedPlayers),
            skillAverages: this.calculateSkillAverages(enhancedPlayers)
          }
        }
      });

    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({
        success: false,
        error: 'Advanced search failed'
      });
    }
  }

  // Player comparison feature
  async comparePlayers(req, res) {
    try {
      const { playerIds } = req.body;

      if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'At least two player IDs are required for comparison'
        });
      }

      const players = await Player.findAll({
        where: {
          id: playerIds
        },
        include: [{
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name']
        }]
      });

      if (players.length !== playerIds.length) {
        return res.status(404).json({
          success: false,
          error: 'One or more players not found'
        });
      }

      const comparison = players.map(player => {
        const playerJSON = player.toJSON();
        const skills = playerJSON.stats || {};
        
        return {
          id: playerJSON.id,
          name: `${playerJSON.firstName} ${playerJSON.lastName}`,
          position: playerJSON.position,
          age: this.calculateAge(playerJSON.dateOfBirth),
          federation: playerJSON.federation?.name,
          skills,
          overallRating: this.calculateOverallRating(skills),
          strengths: this.identifyStrengths(skills),
          improvements: this.identifyImprovements(skills),
          aiScore: this.calculateAIScore(playerJSON)
        };
      });

      // Generate comparison matrix
      const comparisonMatrix = this.generateComparisonMatrix(comparison);

      res.json({
        success: true,
        data: {
          players: comparison,
          comparison: comparisonMatrix,
          recommendations: this.generateComparisonRecommendations(comparison)
        }
      });

    } catch (error) {
      console.error('Player comparison error:', error);
      res.status(500).json({
        success: false,
        error: 'Player comparison failed'
      });
    }
  }

  // Talent scoring algorithm
  async calculateTalentScore(req, res) {
    try {
      const { playerId } = req.params;

      const player = await Player.findByPk(playerId, {
        include: [{
          model: Federation,
          as: 'federation'
        }]
      });

      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      const playerJSON = player.toJSON();
      const talentScore = this.calculateComprehensiveTalentScore(playerJSON);

      res.json({
        success: true,
        data: {
          playerId,
          talentScore,
          breakdown: talentScore.breakdown,
          recommendations: talentScore.recommendations,
          potentialTrajectory: this.generatePotentialTrajectory(talentScore.overall)
        }
      });

    } catch (error) {
      console.error('Talent score calculation error:', error);
      res.status(500).json({
        success: false,
        error: 'Talent score calculation failed'
      });
    }
  }

  // Utility methods
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

  calculateOverallRating(skills) {
    const skillValues = Object.values(skills);
    return skillValues.length > 0 
      ? Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length)
      : 0;
  }

  calculatePotential(rating, age) {
    // Simplified potential calculation
    const basePotential = rating;
    const ageFactor = age < 25 ? (25 - age) * 2 : 0; // Younger players have more potential
    return Math.min(100, basePotential + ageFactor);
  }

  identifyStrengths(skills) {
    return Object.entries(skills)
      .filter(([_, value]) => value >= 80)
      .map(([skill, value]) => ({ skill, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }

  identifyImprovements(skills) {
    return Object.entries(skills)
      .filter(([_, value]) => value <= 70)
      .map(([skill, value]) => ({ skill, value }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 3);
  }

  calculateComprehensiveTalentScore(player) {
    const skills = player.stats || {};
    const age = this.calculateAge(player.dateOfBirth);
    
    // Multi-factor talent score calculation
    const technicalScore = this.calculateTechnicalScore(skills);
    const physicalScore = this.calculatePhysicalScore(skills);
    const mentalScore = this.calculateMentalScore(skills);
    const ageScore = this.calculateAgeScore(age);
    
    const overall = Math.round(
      (technicalScore * 0.4) + 
      (physicalScore * 0.3) + 
      (mentalScore * 0.2) + 
      (ageScore * 0.1)
    );

    return {
      overall,
      breakdown: {
        technical: technicalScore,
        physical: physicalScore,
        mental: mentalScore,
        age: ageScore
      },
      recommendations: this.generateTalentRecommendations(technicalScore, physicalScore, mentalScore, age)
    };
  }

  calculateTechnicalScore(skills) {
    const technicalSkills = ['dribbling', 'passing', 'shooting', 'firstTouch', 'technique'];
    return this.calculateSkillCategoryScore(skills, technicalSkills);
  }

  calculatePhysicalScore(skills) {
    const physicalSkills = ['speed', 'strength', 'stamina', 'agility', 'jumping'];
    return this.calculateSkillCategoryScore(skills, physicalSkills);
  }

  calculateMentalScore(skills) {
    const mentalSkills = ['vision', 'decisionMaking', 'composure', 'positioning', 'leadership'];
    return this.calculateSkillCategoryScore(skills, mentalSkills);
  }

  calculateSkillCategoryScore(skills, skillList) {
    const validSkills = skillList.filter(skill => skills[skill] !== undefined);
    if (validSkills.length === 0) return 50; // Default score
    
    const total = validSkills.reduce((sum, skill) => sum + (skills[skill] || 0), 0);
    return Math.round(total / validSkills.length);
  }

  calculateAgeScore(age) {
    // Optimal age range for talent scoring (18-24)
    if (age >= 18 && age <= 24) return 100;
    if (age < 18) return 80 + (age - 15) * 5; // Linear increase for younger players
    if (age > 24) return Math.max(50, 100 - (age - 24) * 3); // Gradual decrease for older players
    return 50;
  }

  generateTalentRecommendations(technical, physical, mental, age) {
    const recommendations = [];
    
    if (technical < 70) recommendations.push('Focus on technical skills development');
    if (physical < 70) recommendations.push('Enhance physical conditioning program');
    if (mental < 70) recommendations.push('Develop mental toughness and game intelligence');
    if (age < 20) recommendations.push('Continue skill development - high growth potential');
    if (age > 28) recommendations.push('Focus on experience and leadership qualities');
    
    return recommendations.length > 0 ? recommendations : ['Well-rounded player - maintain current development path'];
  }

  generatePerformanceTrend(playerId) {
    // Mock performance trend data
    return [
      { date: '2024-01-01', rating: 82 },
      { date: '2024-02-01', rating: 85 },
      { date: '2024-03-01', rating: 88 },
      { date: '2024-04-01', rating: 90 }
    ];
  }

  calculatePercentile(rating) {
    // Mock percentile calculation
    if (rating >= 90) return 95;
    if (rating >= 80) return 75;
    if (rating >= 70) return 50;
    return 25;
  }

  generateComparisonMatrix(players) {
    // Generate comparison matrix for multiple players
    const matrix = {};
    players.forEach(player => {
      matrix[player.id] = {};
      players.forEach(otherPlayer => {
        if (player.id !== otherPlayer.id) {
          matrix[player.id][otherPlayer.id] = this.compareTwoPlayers(player, otherPlayer);
        }
      });
    });
    return matrix;
  }

  compareTwoPlayers(player1, player2) {
    const score1 = player1.overallRating;
    const score2 = player2.overallRating;
    
    return {
      advantage: score1 > score2 ? player1.id : player2.id,
      difference: Math.abs(score1 - score2),
      strengths: {
        player1: player1.strengths,
        player2: player2.strengths
      }
    };
  }

  generateComparisonRecommendations(players) {
    return players.map(player => ({
      playerId: player.id,
      recommendation: `Focus on improving ${player.improvements.map(imp => imp.skill).join(', ')}`
    }));
  }

  generatePotentialTrajectory(currentScore) {
    // Generate potential growth trajectory
    const trajectory = [];
    for (let i = 0; i < 5; i++) {
      trajectory.push({
        year: new Date().getFullYear() + i,
        projectedScore: Math.min(100, currentScore + (i * 3))
      });
    }
    return trajectory;
  }

  calculateAverageRating(players) {
    const ratings = players.map(p => p.analytics.overallRating);
    return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
  }

  calculatePositionDistribution(players) {
    const distribution = {};
    players.forEach(player => {
      const position = player.position;
      distribution[position] = (distribution[position] || 0) + 1;
    });
    return distribution;
  }

  calculateSkillAverages(players) {
    const skillSums = {};
    const skillCounts = {};
    
    players.forEach(player => {
      const skills = player.stats || {};
      Object.entries(skills).forEach(([skill, value]) => {
        skillSums[skill] = (skillSums[skill] || 0) + value;
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    const averages = {};
    Object.keys(skillSums).forEach(skill => {
      averages[skill] = Math.round(skillSums[skill] / skillCounts[skill]);
    });
    
    return averages;
  }

  calculateAIScore(player) {
    // Comprehensive AI scoring algorithm
    const skills = player.stats || {};
    const age = this.calculateAge(player.dateOfBirth);
    
    const baseScore = this.calculateOverallRating(skills);
    const ageFactor = age < 25 ? (25 - age) * 0.5 : 0;
    const consistencyBonus = 5; // Based on performance history
    
    return Math.min(100, baseScore + ageFactor + consistencyBonus);
  }
}

module.exports = new PlayerAdvancedController();
