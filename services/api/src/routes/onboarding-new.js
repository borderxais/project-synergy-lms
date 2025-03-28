const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');
const { db, admin } = require('../config/firebase');

// Helper to remove undefined and null values from an object recursively
const cleanObject = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      cleanObject(obj[key]);
    }
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

// Submit onboarding data
router.post('/onboarding', authenticateToken, async (req, res) => {
  try {
    const onboardingData = req.body;
    const userId = req.user.id;  // Get userId from authenticated token
    console.log('Received onboarding data for user:', userId, onboardingData);

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Update user profile with onboarding data
    const userRef = db.collection('users').doc(userId);
    
    // First check if the document exists
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new Error('User document not found');
    }

    // Update the document with cleaned data
    const cleanedData = cleanObject({
      studentProfile: {
        collegePreferences: {
          schoolCategories: onboardingData.collegePreferences?.schoolCategories || [],
          targetSchools: onboardingData.collegePreferences?.targetSchools || [],
          earlyDecision: onboardingData.collegePreferences?.earlyDecision || 'none'
        },
        generalInfo: onboardingData.generalInfo || {},
        highSchoolProfile: onboardingData.highSchoolProfile || {},
        interests: onboardingData.interests || [],
        onboardingCompleted: true,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      },
      'isOnboarded': true,  // Set isOnboarded to true after successful onboarding
      'onboardedAt': admin.firestore.FieldValue.serverTimestamp(),
      'lastTaskGeneratedAt': admin.firestore.FieldValue.serverTimestamp(),
      'totalTasks': 0,
      'updatedAt': admin.firestore.FieldValue.serverTimestamp()
    });

    await userRef.update(cleanedData);

    // Get target schools and interests for logging
    const targetSchools = onboardingData.collegePreferences?.targetSchools || [];
    const interests = onboardingData.interests || [];
    console.log('Target schools array:', targetSchools);
    console.log('Student interests:', interests);

    if (targetSchools.length > 0) {
      const targetSchoolNames = targetSchools;
      console.log('Target school names:', targetSchoolNames);

      // 1. Get college info from Firestore - only for selected schools
      const collegeData = [];
      for (const schoolName of targetSchoolNames) {
        const collegeQuery = await db.collection('US-Colleges')
          .where('schoolName', '==', schoolName)
          .get();
          
        if (!collegeQuery.empty) {
          collegeData.push(collegeQuery.docs[0].data());
        } else {
          console.error('College not found:', schoolName);
          throw new Error(`College "${schoolName}" not found in database`);
        }
      }
      
      console.log('College data from Firestore:', collegeData);

      // 2. Generate roadmap tasks
      console.log('Generating roadmap tasks...');
      let tasks;
      try {
        // Ensure proper payload structure
        const roadmapPayload = {
          userId,
          targetSchool: targetSchoolNames,
          schoolInfo: collegeData
        };

        console.log('Sending roadmap request with payload:', JSON.stringify(roadmapPayload, null, 2));

        // Add retry logic with exponential backoff
        const maxRetries = 3;
        let retryCount = 0;
        let lastError;

        while (retryCount < maxRetries) {
          try {
            const roadmapResponse = await axios.post(
              'http://localhost:3003/generate-roadmap-from-db', 
              roadmapPayload,
              {
                timeout: 60000,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            tasks = roadmapResponse.data.data.tasks;
            console.log('Generated tasks:', JSON.stringify(tasks, null, 2));
            break;
          } catch (error) {
            lastError = error;
            console.error('Error in roadmap generation attempt:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
              payload: roadmapPayload // Log the payload that caused the error
            });
            retryCount++;
            if (retryCount < maxRetries) {
              const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
              console.log(`Retry ${retryCount}/${maxRetries} after ${delay}ms`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }

        if (!tasks) {
          throw lastError || new Error('Failed to generate tasks after retries');
        }

        // Format tasks with proper timestamps
        const formattedTasks = tasks.map(task => {
          const now = admin.firestore.Timestamp.now();
          const dueDate = task.dueDate ? new Date(task.dueDate) : new Date(now.toDate());
          if (!task.dueDate) {
            dueDate.setMonth(dueDate.getMonth() + 3);
          }

          return {
            category: task.category || "general",
            createdAt: now,
            dueDate: admin.firestore.Timestamp.fromDate(dueDate),
            isCompleted: false,
            priority: task.priority || "medium",
            title: task.title,
            description: task.description,
            school: task.school || "All Schools",
            updatedAt: now
          };
        });

        // Update user document with tasks and metadata
        await db.collection('users').doc(userId).update({
          tasks: formattedTasks,
          totalTasks: formattedTasks.length,
          recommendations: [], // Since we don't have recommendations in the current response
          lastTaskGeneratedAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
          isOnboarded: true
        });

        console.log('Successfully stored tasks in user document');

        // Send success response
        res.status(200).json({
          success: true,
          message: 'Onboarding completed successfully',
          tasks: formattedTasks
        });
      } catch (error) {
        console.error('Error generating roadmap:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        });
        throw new Error(`Failed to generate roadmap: ${error.message}`);
      }
    } else {
      // Send success response
      res.status(200).json({
        success: true,
        message: 'Onboarding completed successfully'
      });
    }
  } catch (error) {
    console.error('Error in onboarding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analyze schools using LLM
router.post('/analyze-schools', async (req, res) => {
  try {
    const { schools, studentProfile } = req.body;
    console.log('Analyzing schools:', schools);
    console.log('Student profile:', studentProfile);

    // Call Python FastAPI endpoint
    const response = await axios.post('http://localhost:3003/analyze-schools', {
      schools,
      studentProfile
    }, {
      headers: {
        'user-id': req.user.id
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error analyzing schools:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to analyze schools'
    });
  }
});

module.exports = router;
