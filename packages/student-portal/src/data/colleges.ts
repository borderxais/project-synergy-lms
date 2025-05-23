// export interface College {
//   name: string;
//   type: 'public' | 'private';
//   state: string;
//   ranking?: number;
//   category?: string[];
// }

// export const COLLEGES: College[] = [
//   // Ivy League
//   { name: 'Harvard University', type: 'private', state: 'MA', ranking: 1, category: ['ivy', 'top10', 'research'] },
//   { name: 'Yale University', type: 'private', state: 'CT', ranking: 3, category: ['ivy', 'top10', 'research'] },
//   { name: 'Princeton University', type: 'private', state: 'NJ', ranking: 2, category: ['ivy', 'top10', 'research'] },
//   { name: 'Columbia University', type: 'private', state: 'NY', ranking: 7, category: ['ivy', 'top10', 'research'] },
//   { name: 'University of Pennsylvania', type: 'private', state: 'PA', ranking: 6, category: ['ivy', 'top10', 'research'] },
//   { name: 'Brown University', type: 'private', state: 'RI', ranking: 13, category: ['ivy', 'top30', 'research'] },
//   { name: 'Dartmouth College', type: 'private', state: 'NH', ranking: 12, category: ['ivy', 'top30', 'research'] },
//   { name: 'Cornell University', type: 'private', state: 'NY', ranking: 17, category: ['ivy', 'top30', 'research'] },

//   // Top Private Universities
//   { name: 'Stanford University', type: 'private', state: 'CA', ranking: 4, category: ['top10', 'research'] },
//   { name: 'MIT', type: 'private', state: 'MA', ranking: 5, category: ['top10', 'research', 'technical'] },
//   { name: 'California Institute of Technology', type: 'private', state: 'CA', ranking: 8, category: ['top10', 'technical'] },
//   { name: 'Johns Hopkins University', type: 'private', state: 'MD', ranking: 9, category: ['top10', 'research'] },
//   { name: 'Northwestern University', type: 'private', state: 'IL', ranking: 10, category: ['top10', 'research'] },
//   { name: 'Duke University', type: 'private', state: 'NC', ranking: 11, category: ['top30', 'research'] },
//   { name: 'Vanderbilt University', type: 'private', state: 'TN', ranking: 14, category: ['top30', 'research'] },
//   { name: 'Rice University', type: 'private', state: 'TX', ranking: 15, category: ['top30', 'research'] },

//   // UC System
//   { name: 'UC Berkeley', type: 'public', state: 'CA', ranking: 20, category: ['uc', 'top30', 'research'] },
//   { name: 'UCLA', type: 'public', state: 'CA', ranking: 22, category: ['uc', 'top30', 'research'] },
//   { name: 'UC San Diego', type: 'public', state: 'CA', ranking: 34, category: ['uc', 'top50', 'research'] },
//   { name: 'UC Davis', type: 'public', state: 'CA', ranking: 38, category: ['uc', 'top50', 'research'] },
//   { name: 'UC Irvine', type: 'public', state: 'CA', ranking: 36, category: ['uc', 'top50', 'research'] },
//   { name: 'UC Santa Barbara', type: 'public', state: 'CA', ranking: 32, category: ['uc', 'top50', 'research'] },
//   { name: 'UC Santa Cruz', type: 'public', state: 'CA', ranking: 83, category: ['uc', 'research'] },
//   { name: 'UC Riverside', type: 'public', state: 'CA', ranking: 89, category: ['uc', 'research'] },
//   { name: 'UC Merced', type: 'public', state: 'CA', ranking: 97, category: ['uc', 'research'] },

//   // Other Top Public Universities
//   { name: 'University of Michigan', type: 'public', state: 'MI', ranking: 21, category: ['top30', 'research'] },
//   { name: 'University of Virginia', type: 'public', state: 'VA', ranking: 25, category: ['top30', 'research'] },
//   { name: 'Georgia Institute of Technology', type: 'public', state: 'GA', ranking: 29, category: ['top30', 'technical'] },
//   { name: 'University of North Carolina', type: 'public', state: 'NC', ranking: 28, category: ['top30', 'research'] },
//   { name: 'University of Illinois', type: 'public', state: 'IL', ranking: 41, category: ['top50', 'research'] },
//   { name: 'University of Wisconsin', type: 'public', state: 'WI', ranking: 42, category: ['top50', 'research'] },

//   // Liberal Arts Colleges
//   { name: 'Williams College', type: 'private', state: 'MA', ranking: 1, category: ['liberal-arts'] },
//   { name: 'Amherst College', type: 'private', state: 'MA', ranking: 2, category: ['liberal-arts'] },
//   { name: 'Swarthmore College', type: 'private', state: 'PA', ranking: 3, category: ['liberal-arts'] },
//   { name: 'Pomona College', type: 'private', state: 'CA', ranking: 4, category: ['liberal-arts'] },
//   { name: 'Wellesley College', type: 'private', state: 'MA', ranking: 5, category: ['liberal-arts'] },

//   // Technical Institutes
//   { name: 'Rose-Hulman Institute of Technology', type: 'private', state: 'IN', category: ['technical'] },
//   { name: 'Worcester Polytechnic Institute', type: 'private', state: 'MA', category: ['technical'] },
//   { name: 'Rochester Institute of Technology', type: 'private', state: 'NY', category: ['technical'] },
//   { name: 'Stevens Institute of Technology', type: 'private', state: 'NJ', category: ['technical'] },
// ];

export interface College {
  name: string;           // Display name
  firestoreId: string;    // ID in Firestore database
  type: 'public' | 'private';
  state: string;
  ranking?: number;
  category?: string[];
}

export const COLLEGES: College[] = [
  // Ivy League
  { name: 'Harvard University', firestoreId: 'Harvard University', type: 'private', state: 'MA', ranking: 1, category: ['ivy', 'top10', 'research'] },
  { name: 'Yale University', firestoreId: 'Yale University', type: 'private', state: 'CT', ranking: 3, category: ['ivy', 'top10', 'research'] },
  { name: 'Princeton University', firestoreId: 'Princeton University', type: 'private', state: 'NJ', ranking: 2, category: ['ivy', 'top10', 'research'] },
  { name: 'Columbia University', firestoreId: 'Columbia University', type: 'private', state: 'NY', ranking: 7, category: ['ivy', 'top10', 'research'] },
  { name: 'University of Pennsylvania', firestoreId: 'University of Pennsylvania', type: 'private', state: 'PA', ranking: 6, category: ['ivy', 'top10', 'research'] },
  { name: 'Brown University', firestoreId: 'Brown University', type: 'private', state: 'RI', ranking: 13, category: ['ivy', 'top30', 'research'] },
  { name: 'Dartmouth College', firestoreId: 'Dartmouth College', type: 'private', state: 'NH', ranking: 12, category: ['ivy', 'top30', 'research'] },
  { name: 'Cornell University', firestoreId: 'Cornell University', type: 'private', state: 'NY', ranking: 17, category: ['ivy', 'top30', 'research'] },

  // Top Private Universities
  { name: 'Stanford University', firestoreId: 'Stanford University', type: 'private', state: 'CA', ranking: 4, category: ['top10', 'research'] },
  { name: 'Massachusetts Institute of Technology', firestoreId: 'Massachusetts Institute of Technology', type: 'private', state: 'MA', ranking: 5, category: ['top10', 'research', 'technical'] },
  { name: 'California Institute of Technology', firestoreId: 'California Institute of Technology', type: 'private', state: 'CA', ranking: 8, category: ['top10', 'technical'] },
  { name: 'Johns Hopkins University', firestoreId: 'Johns Hopkins University', type: 'private', state: 'MD', ranking: 9, category: ['top10', 'research'] },
  { name: 'Northwestern University', firestoreId: 'Northwestern University', type: 'private', state: 'IL', ranking: 10, category: ['top10', 'research'] },
  { name: 'Duke University', firestoreId: 'Duke University', type: 'private', state: 'NC', ranking: 11, category: ['top30', 'research'] },
  { name: 'University of Chicago', firestoreId: 'University of Chicago', type: 'private', state: 'IL', ranking: 6, category: ['top10', 'research'] },
  { name: 'Carnegie Mellon University', firestoreId: 'Carnegie Mellon University', type: 'private', state: 'PA', ranking: 22, category: ['top30', 'research', 'technical'] },

  // Public Universities
  { name: 'University of California, Berkeley', firestoreId: 'University of California-Berkeley', type: 'public', state: 'CA', ranking: 20, category: ['top30', 'public', 'uc', 'research'] },
  { name: 'University of California, Los Angeles', firestoreId: 'University of California-Los Angeles', type: 'public', state: 'CA', ranking: 20, category: ['top30', 'public', 'uc', 'research'] },
  { name: 'University of Michigan, Ann Arbor', firestoreId: 'University of Michigan-Ann Arbor', type: 'public', state: 'MI', ranking: 23, category: ['top30', 'public', 'research'] },
  { name: 'University of Virginia', firestoreId: 'University of Virginia', type: 'public', state: 'VA', ranking: 25, category: ['top30', 'public', 'research'] },
  { name: 'University of North Carolina, Chapel Hill', firestoreId: 'University of North Carolina-Chapel Hill', type: 'public', state: 'NC', ranking: 28, category: ['top30', 'public', 'research'] },
  { name: 'University of California, San Diego', firestoreId: 'University of California-San Diego', type: 'public', state: 'CA', ranking: 34, category: ['top50', 'public', 'uc', 'research'] },
  { name: 'University of California, Davis', firestoreId: 'University of California-Davis', type: 'public', state: 'CA', ranking: 38, category: ['top50', 'public', 'uc', 'research'] },
  { name: 'University of California, Santa Barbara', firestoreId: 'University of California-Santa Barbara', type: 'public', state: 'CA', ranking: 32, category: ['top50', 'public', 'uc', 'research'] },
  { name: 'University of California, Irvine', firestoreId: 'University of California-Irvine', type: 'public', state: 'CA', ranking: 36, category: ['top50', 'public', 'uc', 'research'] },
  { name: 'University of Florida', firestoreId: 'University of Florida', type: 'public', state: 'FL', ranking: 29, category: ['top30', 'public', 'research'] },
  { name: 'University of Texas, Austin', firestoreId: 'University of Texas-Austin', type: 'public', state: 'TX', ranking: 38, category: ['top50', 'public', 'research'] },
  { name: 'University of Wisconsin, Madison', firestoreId: 'University of Wisconsin-Madison', type: 'public', state: 'WI', ranking: 42, category: ['top50', 'public', 'research'] },
  { name: 'University of Illinois, Urbana-Champaign', firestoreId: 'University of Illinois-Urbana-Champaign', type: 'public', state: 'IL', ranking: 47, category: ['top50', 'public', 'research'] },
  { name: 'Georgia Institute of Technology', firestoreId: 'Georgia Institute of Technology', type: 'public', state: 'GA', ranking: 35, category: ['top50', 'public', 'technical'] },
  { name: 'University of Washington', firestoreId: 'University of Washington', type: 'public', state: 'WA', ranking: 59, category: ['public', 'research'] },
  { name: 'Ohio State University', firestoreId: 'Ohio State University-Columbus', type: 'public', state: 'OH', ranking: 49, category: ['top50', 'public', 'research'] },
  { name: 'Pennsylvania State University', firestoreId: 'Pennsylvania State University-University Park', type: 'public', state: 'PA', ranking: 63, category: ['public', 'research'] },
  { name: 'Purdue University', firestoreId: 'Purdue University', type: 'public', state: 'IN', ranking: 53, category: ['public', 'research'] },
  { name: 'University of Maryland, College Park', firestoreId: 'University of Maryland-College Park', type: 'public', state: 'MD', ranking: 58, category: ['public', 'research'] },
  
  // Other notable universities
  { name: 'New York University', firestoreId: 'New York University', type: 'private', state: 'NY', ranking: 25, category: ['top30', 'research'] },
  { name: 'Boston University', firestoreId: 'Boston University', type: 'private', state: 'MA', ranking: 42, category: ['top50', 'research'] },
  { name: 'Tufts University', firestoreId: 'Tufts University', type: 'private', state: 'MA', ranking: 32, category: ['top50', 'research'] },
  { name: 'University of Southern California', firestoreId: 'University of Southern California', type: 'private', state: 'CA', ranking: 27, category: ['top30', 'research'] },
  { name: 'Boston College', firestoreId: 'Boston College', type: 'private', state: 'MA', ranking: 36, category: ['top50', 'research'] },
  { name: 'Brandeis University', firestoreId: 'Brandeis University', type: 'private', state: 'MA', ranking: 42, category: ['top50', 'research'] },
  { name: 'Northeastern University', firestoreId: 'Northeastern University', type: 'private', state: 'MA', ranking: 40, category: ['top50', 'research'] },
  { name: 'Case Western Reserve University', firestoreId: 'Case Western Reserve University', type: 'private', state: 'OH', ranking: 42, category: ['top50', 'research'] },
  { name: 'Emory University', firestoreId: 'Emory University', type: 'private', state: 'GA', ranking: 21, category: ['top30', 'research'] },
  { name: 'Georgetown University', firestoreId: 'Georgetown University', type: 'private', state: 'DC', ranking: 22, category: ['top30', 'research'] },
  { name: 'University of Notre Dame', firestoreId: 'University of Notre Dame', type: 'private', state: 'IN', ranking: 18, category: ['top30', 'research'] },
  { name: 'Vanderbilt University', firestoreId: 'Vanderbilt University', type: 'private', state: 'TN', ranking: 13, category: ['top30', 'research'] },
  { name: 'Washington University in St. Louis', firestoreId: 'Washington University in St. Louis', type: 'private', state: 'MO', ranking: 15, category: ['top30', 'research'] },
  { name: 'Rice University', firestoreId: 'Rice University', type: 'private', state: 'TX', ranking: 17, category: ['top30', 'research'] },
  
  // Additional colleges from your Firestore database
  { name: 'Adelphi University', firestoreId: 'Adelphi University', type: 'private', state: 'NY', category: ['private'] },
  { name: 'American University', firestoreId: 'American University', type: 'private', state: 'DC', category: ['private'] },
  { name: 'Arizona State University', firestoreId: 'Arizona State University', type: 'public', state: 'AZ', category: ['public'] },
  { name: 'Auburn University', firestoreId: 'Auburn University', type: 'public', state: 'AL', category: ['public'] },
  { name: 'Baylor University', firestoreId: 'Baylor University', type: 'private', state: 'TX', category: ['private'] },
  { name: 'Binghamton University', firestoreId: 'Binghamton University', type: 'public', state: 'NY', category: ['public'] },
  { name: 'Brigham Young University', firestoreId: 'Brigham Young University', type: 'private', state: 'UT', category: ['private'] },
  { name: 'CUNY-City College', firestoreId: 'CUNY-City College', type: 'public', state: 'NY', category: ['public'] },
  { name: 'California State University-Fullerton', firestoreId: 'California State University-Fullerton', type: 'public', state: 'CA', category: ['public'] },
  { name: 'California State University-Long Beach', firestoreId: 'California State University-Long Beach', type: 'public', state: 'CA', category: ['public'] },
  { name: 'Chapman University', firestoreId: 'Chapman University', type: 'private', state: 'CA', category: ['private'] },
  { name: 'Clark University', firestoreId: 'Clark University', type: 'private', state: 'MA', category: ['private'] },
  { name: 'Clarkson University', firestoreId: 'Clarkson University', type: 'private', state: 'NY', category: ['private'] },
  { name: 'Clemson University', firestoreId: 'Clemson University', type: 'public', state: 'SC', category: ['public'] },
  { name: 'College of William and Mary', firestoreId: 'College of William and Mary', type: 'public', state: 'VA', category: ['public'] },
  { name: 'Colorado School of Mines', firestoreId: 'Colorado School of Mines', type: 'public', state: 'CO', category: ['public', 'technical'] },
  { name: 'Colorado State University', firestoreId: 'Colorado State University', type: 'public', state: 'CO', category: ['public'] },
  { name: 'Creighton University', firestoreId: 'Creighton University', type: 'private', state: 'NE', category: ['private'] },
  { name: 'DePaul University', firestoreId: 'DePaul University', type: 'private', state: 'IL', category: ['private'] },
  { name: 'Drake University', firestoreId: 'Drake University', type: 'private', state: 'IA', category: ['private'] },
  { name: 'Drexel University', firestoreId: 'Drexel University', type: 'private', state: 'PA', category: ['private'] },
  { name: 'Duquesne University', firestoreId: 'Duquesne University', type: 'private', state: 'PA', category: ['private'] },
  { name: 'Elon University', firestoreId: 'Elon University', type: 'private', state: 'NC', category: ['private'] },
  { name: 'Fairfield University', firestoreId: 'Fairfield University', type: 'private', state: 'CT', category: ['private'] },
  { name: 'Florida International University', firestoreId: 'Florida International University', type: 'public', state: 'FL', category: ['public'] },
  { name: 'Florida State University', firestoreId: 'Florida State University', type: 'public', state: 'FL', category: ['public'] },
  { name: 'Fordham University', firestoreId: 'Fordham University', type: 'private', state: 'NY', category: ['private'] },
  { name: 'Gallaudet University', firestoreId: 'Gallaudet University', type: 'private', state: 'DC', category: ['private'] },
  { name: 'George Mason University', firestoreId: 'George Mason University', type: 'public', state: 'VA', category: ['public'] },
  { name: 'George Washington University', firestoreId: 'George Washington University', type: 'private', state: 'DC', category: ['private'] },
  { name: 'Gonzaga University', firestoreId: 'Gonzaga University', type: 'private', state: 'WA', category: ['private'] },
  { name: 'Hofstra University', firestoreId: 'Hofstra University', type: 'private', state: 'NY', category: ['private'] },
  { name: 'Howard University', firestoreId: 'Howard University', type: 'private', state: 'DC', category: ['private'] },
  { name: 'Illinois Institute of Technology', firestoreId: 'Illinois Institute of Technology', type: 'private', state: 'IL', category: ['private', 'technical'] },
  { name: 'Illinois State University', firestoreId: 'Illinois State University', type: 'public', state: 'IL', category: ['public'] },
  { name: 'Indiana University-Bloomington', firestoreId: 'Indiana University-Bloomington', type: 'public', state: 'IN', category: ['public'] },
  { name: 'Iowa State University', firestoreId: 'Iowa State University of Science and Technology', type: 'public', state: 'IA', category: ['public'] },
  { name: 'James Madison University', firestoreId: 'James Madison University', type: 'public', state: 'VA', category: ['public'] },
  { name: 'Kansas State University', firestoreId: 'Kansas State University', type: 'public', state: 'KS', category: ['public'] },
  { name: 'Lehigh University', firestoreId: 'Lehigh University', type: 'private', state: 'PA', category: ['private'] },
  { name: 'Louisiana State University', firestoreId: 'Louisiana State University-Baton Rouge', type: 'public', state: 'LA', category: ['public'] },
  { name: 'Loyola Marymount University', firestoreId: 'Loyola Marymount University', type: 'private', state: 'CA', category: ['private'] },
  { name: 'Loyola University Chicago', firestoreId: 'Loyola University Chicago', type: 'private', state: 'IL', category: ['private'] },
  { name: 'Marquette University', firestoreId: 'Marquette University', type: 'private', state: 'WI', category: ['private'] },
  { name: 'Mercer University', firestoreId: 'Mercer University', type: 'private', state: 'GA', category: ['private'] },
  { name: 'Miami University-Oxford', firestoreId: 'Miami University-Oxford', type: 'public', state: 'OH', category: ['public'] },
  { name: 'Michigan State University', firestoreId: 'Michigan State University', type: 'public', state: 'MI', category: ['public'] },
  { name: 'Michigan Technological University', firestoreId: 'Michigan Technological University', type: 'public', state: 'MI', category: ['public', 'technical'] },
  { name: 'Mississippi State University', firestoreId: 'Mississippi State University', type: 'public', state: 'MS', category: ['public'] },
  { name: 'Missouri University of Science & Technology', firestoreId: 'Missouri University of Science & Technology', type: 'public', state: 'MO', category: ['public', 'technical'] },
  { name: 'New Jersey Institute of Technology', firestoreId: 'New Jersey Institute of Technology', type: 'public', state: 'NJ', category: ['public', 'technical'] },
  { name: 'North Carolina State University', firestoreId: 'North Carolina State University', type: 'public', state: 'NC', category: ['public'] },
  { name: 'Oklahoma State University', firestoreId: 'Oklahoma State University', type: 'public', state: 'OK', category: ['public'] },
  { name: 'Oregon State University', firestoreId: 'Oregon State University', type: 'public', state: 'OR', category: ['public'] },
  { name: 'Pepperdine University', firestoreId: 'Pepperdine University', type: 'private', state: 'CA', category: ['private'] },
  { name: 'Quinnipiac University', firestoreId: 'Quinnipiac University', type: 'private', state: 'CT', category: ['private'] },
  { name: 'Rensselaer Polytechnic Institute', firestoreId: 'Rensselaer Polytechnic Institute', type: 'private', state: 'NY', category: ['private', 'technical'] },
  { name: 'Rochester Institute of Technology', firestoreId: 'Rochester Institute of Technology', type: 'private', state: 'NY', category: ['private', 'technical'] },
  { name: 'Rutgers University-Camden', firestoreId: 'Rutgers University-Camden', type: 'public', state: 'NJ', category: ['public'] },
  { name: 'Rutgers University-New Brunswick', firestoreId: 'Rutgers University-New Brunswick', type: 'public', state: 'NJ', category: ['public'] },
  { name: 'Rutgers University-Newark', firestoreId: 'Rutgers University-Newark', type: 'public', state: 'NJ', category: ['public'] },
  { name: 'SUNY College of Environmental Science and Forestry', firestoreId: 'SUNY College of Environmental Science and Forestry', type: 'public', state: 'NY', category: ['public'] },
  { name: 'SUNY Polytechnic Institute', firestoreId: 'SUNY Polytechnic Institute', type: 'public', state: 'NY', category: ['public', 'technical'] },
  { name: 'Saint Louis University', firestoreId: 'Saint Louis University', type: 'private', state: 'MO', category: ['private'] },
  { name: 'Samford University', firestoreId: 'Samford University', type: 'private', state: 'AL', category: ['private'] },
  { name: 'San Diego State University', firestoreId: 'San Diego State University', type: 'public', state: 'CA', category: ['public'] },
  { name: 'Santa Clara University', firestoreId: 'Santa Clara University', type: 'private', state: 'CA', category: ['private'] },
  { name: 'Seattle University', firestoreId: 'Seattle University', type: 'private', state: 'WA', category: ['private'] },
  { name: 'Seton Hall University', firestoreId: 'Seton Hall University', type: 'private', state: 'NJ', category: ['private'] },
  { name: 'Simmons University', firestoreId: 'Simmons University', type: 'private', state: 'MA', category: ['private'] },
  { name: 'South Carolina State University', firestoreId: 'South Carolina State University', type: 'public', state: 'SC', category: ['public'] },
  { name: 'St. John Fisher College', firestoreId: 'St. John Fisher College', type: 'private', state: 'NY', category: ['private'] },
  { name: "St. John's University", firestoreId: "St. John's University (NY)", type: 'private', state: 'NY', category: ['private'] },
  { name: 'Stevens Institute of Technology', firestoreId: 'Stevens Institute of Technology', type: 'private', state: 'NJ', category: ['private', 'technical'] },
  { name: 'Stony Brook University', firestoreId: 'Stony Brook University', type: 'public', state: 'NY', category: ['public'] },
  { name: 'Syracuse University', firestoreId: 'Syracuse University', type: 'private', state: 'NY', category: ['private'] },
  { name: 'Temple University', firestoreId: 'Temple University', type: 'public', state: 'PA', category: ['public'] },
  { name: 'Texas A&M University', firestoreId: 'Texas A&M University-College Station', type: 'public', state: 'TX', category: ['public'] },
  { name: 'Texas Christian University', firestoreId: 'Texas Christian University', type: 'private', state: 'TX', category: ['private'] },
  { name: 'The Catholic University of America', firestoreId: 'Catholic University of America', type: 'private', state: 'DC', category: ['private'] },
  { name: 'The New School', firestoreId: 'The New School', type: 'private', state: 'NY', category: ['private'] },
  { name: 'Thomas Jefferson University', firestoreId: 'Thomas Jefferson University', type: 'private', state: 'PA', category: ['private'] },
  { name: 'Tulane University', firestoreId: 'Tulane University', type: 'private', state: 'LA', category: ['private'] },
  { name: 'University at Albany', firestoreId: 'University at Albany', type: 'public', state: 'NY', category: ['public'] },
  { name: 'University at Buffalo', firestoreId: 'University of Buffalo', type: 'public', state: 'NY', category: ['public'] },
  { name: 'University of Alabama', firestoreId: 'University of Alabama', type: 'public', state: 'AL', category: ['public'] },
  { name: 'University of Alabama-Birmingham', firestoreId: 'University of Alabama-Birmingham', type: 'public', state: 'AL', category: ['public'] },
  { name: 'University of Arizona', firestoreId: 'University of Arizona', type: 'public', state: 'AZ', category: ['public'] },
  { name: 'University of Arkansas', firestoreId: 'University of Arkansas', type: 'public', state: 'AR', category: ['public'] },
  { name: 'University of California, Merced', firestoreId: 'University of California-Merced', type: 'public', state: 'CA', category: ['public', 'uc'] },
  { name: 'University of California, Riverside', firestoreId: 'University of California-Riverside', type: 'public', state: 'CA', category: ['public', 'uc'] },
  { name: 'University of California, Santa Cruz', firestoreId: 'University of California-Santa Cruz', type: 'public', state: 'CA', category: ['public', 'uc'] },
  { name: 'University of Central Florida', firestoreId: 'University of Central Florida', type: 'public', state: 'FL', category: ['public'] },
  { name: 'University of Cincinnati', firestoreId: 'University of Cincinnati', type: 'public', state: 'OH', category: ['public'] },
  { name: 'University of Colorado-Boulder', firestoreId: 'University of Colorado-Boulder', type: 'public', state: 'CO', category: ['public'] },
  { name: 'University of Connecticut', firestoreId: 'University of Connecticut', type: 'public', state: 'CT', category: ['public'] },
  { name: 'University of Dayton', firestoreId: 'University of Dayton', type: 'private', state: 'OH', category: ['private'] },
  { name: 'University of Delaware', firestoreId: 'University of Delaware', type: 'public', state: 'DE', category: ['public'] },
  { name: 'University of Denver', firestoreId: 'University of Denver', type: 'private', state: 'CO', category: ['private'] },
  { name: 'University of Houston', firestoreId: 'University of Houston', type: 'public', state: 'TX', category: ['public'] },
  { name: 'University of Illinois-Chicago', firestoreId: 'University of Illinois-Chicago', type: 'public', state: 'IL', category: ['public'] },
  { name: 'University of Iowa', firestoreId: 'University of Iowa', type: 'public', state: 'IA', category: ['public'] },
  { name: 'University of Kansas', firestoreId: 'University of Kansas', type: 'public', state: 'KS', category: ['public'] },
  { name: 'University of Kentucky', firestoreId: 'University of Kentucky', type: 'public', state: 'KY', category: ['public'] },
  { name: 'University of La Verne', firestoreId: 'University of La Verne', type: 'private', state: 'CA', category: ['private'] },
  { name: 'University of Maryland-Baltimore County', firestoreId: 'University of Maryland-Baltimore County', type: 'public', state: 'MD', category: ['public'] },
  { name: 'University of Massachusetts-Amherst', firestoreId: 'University of Massachusetts-Amherst', type: 'public', state: 'MA', category: ['public'] },
  { name: 'University of Minnesota', firestoreId: 'University of Minnesota', type: 'public', state: 'MN', category: ['public'] }
];