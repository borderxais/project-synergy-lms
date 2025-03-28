const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all schools
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM schools
      ORDER BY name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Get school by ID with programs and activities
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const schoolResult = await db.query(`
      SELECT * FROM schools WHERE id = $1
    `, [req.params.id]);

    if (schoolResult.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }

    const school = schoolResult.rows[0];

    // Get programs
    const programsResult = await db.query(`
      SELECT * FROM school_programs WHERE school_id = $1
    `, [req.params.id]);

    // Get activities
    const activitiesResult = await db.query(`
      SELECT * FROM school_activities WHERE school_id = $1
    `, [req.params.id]);

    // Get test requirements
    const testReqResult = await db.query(`
      SELECT * FROM school_test_requirements WHERE school_id = $1
    `, [req.params.id]);

    res.json({
      ...school,
      programs: programsResult.rows,
      activities: activitiesResult.rows,
      testRequirements: testReqResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch school details' });
  }
});

// Add target school for student
router.post('/target', authenticateToken, async (req, res) => {
  const {
    studentId,
    schoolId,
    targetEntryYear,
    targetGrade,
    priorityLevel,
    financialAidNeeded,
    scholarshipNeeded,
    notes
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO student_target_schools (
        student_id, school_id, target_entry_year, target_grade,
        priority_level, financial_aid_needed, scholarship_needed, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      studentId, schoolId, targetEntryYear, targetGrade,
      priorityLevel, financialAidNeeded, scholarshipNeeded, notes
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add target school' });
  }
});

// Get student's target schools
router.get('/student/:studentId/targets', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        sts.*,
        s.name as school_name,
        s.type as school_type,
        s.location_city,
        s.location_state,
        s.acceptance_rate
      FROM student_target_schools sts
      JOIN schools s ON sts.school_id = s.id
      WHERE sts.student_id = $1
      ORDER BY sts.priority_level ASC
    `, [req.params.studentId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target schools' });
  }
});

// Update target school status
router.patch('/target/:id', authenticateToken, async (req, res) => {
  const { applicationStatus, priorityLevel, notes } = req.body;

  try {
    const result = await db.query(`
      UPDATE student_target_schools
      SET 
        application_status = COALESCE($1, application_status),
        priority_level = COALESCE($2, priority_level),
        notes = COALESCE($3, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [applicationStatus, priorityLevel, notes, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Target school not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update target school' });
  }
});

// Remove target school
router.delete('/target/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      DELETE FROM student_target_schools
      WHERE id = $1
      RETURNING *
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Target school not found' });
    }

    res.json({ message: 'Target school removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove target school' });
  }
});

module.exports = router;
