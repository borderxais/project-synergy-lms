import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const studentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string(),
  grade: z.number().min(4).max(8),
  currentSchoolId: z.number(),
  currentSchoolName: z.string().min(1),
  testType: z.enum(['ISEE', 'SSAT']),
  needsEnglishProficiency: z.boolean(),
  applicationDeadline: z.string().optional(),
  academicInterests: z.string().optional(),
  extracurricularActivities: z.string().optional(),
  awardsAchievements: z.string().optional(),
  specialNeeds: z.string().optional()
});

const interestSchema = z.object({
  category: z.string().min(1),
  interest: z.string().min(1),
  proficiencyLevel: z.string().min(1),
  yearsOfExperience: z.number().min(0)
});

export default function studentRoutes(db) {
  router.use(authenticateToken);

  // Get student profile
  router.get('/:id', async (req, res) => {
    try {
      // Get student info with current school
      const studentResult = await db.query(`
        SELECT 
          s.*,
          sch.name as current_school_name,
          sch.type as current_school_type,
          sch.location_city as current_school_city,
          sch.location_state as current_school_state
        FROM students s
        LEFT JOIN schools sch ON s.current_school_id = sch.id
        WHERE s.id = $1
      `, [req.params.id]);

      if (studentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = studentResult.rows[0];

      // Get interests
      const interestsResult = await db.query(`
        SELECT category, interest, proficiency_level, years_of_experience
        FROM student_interests
        WHERE student_id = $1
        ORDER BY category, interest
      `, [req.params.id]);

      // Get target schools
      const targetSchoolsResult = await db.query(`
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
      `, [req.params.id]);

      res.json({
        ...student,
        interests: interestsResult.rows,
        targetSchools: targetSchoolsResult.rows
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch student profile' });
    }
  });

  // Update student profile
  router.patch('/:id', async (req, res) => {
    try {
      const studentData = studentSchema.parse(req.body);

      const result = await db.query(`
        UPDATE students
        SET 
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          date_of_birth = COALESCE($3, date_of_birth),
          grade = COALESCE($4, grade),
          current_school_id = COALESCE($5, current_school_id),
          current_school_name = COALESCE($6, current_school_name),
          test_type = COALESCE($7, test_type),
          needs_english_proficiency = COALESCE($8, needs_english_proficiency),
          application_deadline = COALESCE($9, application_deadline),
          academic_interests = COALESCE($10, academic_interests),
          extracurricular_activities = COALESCE($11, extracurricular_activities),
          awards_achievements = COALESCE($12, awards_achievements),
          special_needs = COALESCE($13, special_needs)
        WHERE id = $14
        RETURNING *
      `, [
        studentData.firstName, studentData.lastName, studentData.dateOfBirth, studentData.grade,
        studentData.currentSchoolId, studentData.currentSchoolName, studentData.testType,
        studentData.needsEnglishProficiency, studentData.applicationDeadline,
        studentData.academicInterests, studentData.extracurricularActivities,
        studentData.awardsAchievements, studentData.specialNeeds, req.params.id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update student profile' });
    }
  });

  // Add or update student interest
  router.post('/:id/interests', async (req, res) => {
    try {
      const interestData = interestSchema.parse(req.body);

      const result = await db.query(`
        INSERT INTO student_interests (
          student_id, category, interest, proficiency_level, years_of_experience
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (student_id, category, interest) 
        DO UPDATE SET
          proficiency_level = EXCLUDED.proficiency_level,
          years_of_experience = EXCLUDED.years_of_experience
        RETURNING *
      `, [req.params.id, interestData.category, interestData.interest, interestData.proficiencyLevel, interestData.yearsOfExperience]);

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add/update student interest' });
    }
  });

  // Remove student interest
  router.delete('/:studentId/interests/:interestId', async (req, res) => {
    try {
      const result = await db.query(`
        DELETE FROM student_interests
        WHERE id = $1 AND student_id = $2
        RETURNING *
      `, [req.params.interestId, req.params.studentId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Interest not found' });
      }

      res.json({ message: 'Interest removed successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove interest' });
    }
  });

  return router;
}