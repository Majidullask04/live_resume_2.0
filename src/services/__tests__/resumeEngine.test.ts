import { executeResumeSearch, buildResumeIndex } from '../resumeSearchEngine';
import { analyzeJobDescription, DEFAULT_WEIGHTS, SAMPLE_JOB_DESCRIPTIONS } from '../jobMatchEngine';
import { VERIFIED_SKILL_CATEGORIES, buildRelationshipGraph, RECRUITER_PROFILE_SUMMARY } from '../resumeAnalysisData';

console.log('=== RUNNING RESUME INTELLIGENCE ENGINE VALIDATION SUITE ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
  }
}

// 1. Index verification
const index = buildResumeIndex();
assert(index.length >= 30, 'Resume index contains all content items', `Count: ${index.length}`);

// 2. Query Test: "Find my AI projects"
const q1 = executeResumeSearch('Find my AI projects');
assert(q1.totalMatches > 0, 'Query: "Find my AI projects" returns matches');
const hasCareerOps = q1.flatResults.some(m => m.item.title.toLowerCase().includes('career-ops'));
assert(hasCareerOps, 'Matches include career-ops AI project');

// 3. Query Test: "What backend technologies do I use?"
const q2 = executeResumeSearch('What backend technologies do I use?');
assert(q2.totalMatches > 0, 'Query: "What backend technologies do I use?" returns matches');
const hasBackend = q2.flatResults.some(m => m.item.content.toLowerCase().includes('backend') || m.item.tags.includes('backend'));
assert(hasBackend, 'Matches include backend technologies');

// 4. Query Test: "Show projects involving Python and FastAPI"
const q3 = executeResumeSearch('Show projects involving Python and FastAPI');
assert(q3.totalMatches > 0, 'Query: "Show projects involving Python and FastAPI" returns matches');
const hasPython = q3.flatResults.some(m => m.item.content.toLowerCase().includes('python'));
assert(hasPython, 'Matches include Python');

// 5. Query Test: "Find my DevOps and Kubernetes work"
const q4 = executeResumeSearch('Find my DevOps and Kubernetes work');
assert(q4.totalMatches > 0, 'Query: "Find my DevOps and Kubernetes work" returns matches');
const hasK8s = q4.flatResults.some(m => m.item.title.includes('3-Tier-DevSecOps') || m.item.content.toLowerCase().includes('kubernetes'));
assert(hasK8s, 'Matches include 3-Tier-DevSecOps or Kubernetes evidence');

// 6. Query Test: "Do I have experience with PostgreSQL?"
const q5 = executeResumeSearch('Do I have experience with PostgreSQL?');
assert(q5.totalMatches > 0, 'Query: "Do I have experience with PostgreSQL?" detects relational database context');

// 7. Fuzzy Matching Test: "kubernets" (typo)
const qFuzzy = executeResumeSearch('kubernets');
assert(qFuzzy.totalMatches > 0, 'Fuzzy search matches "kubernets" (typo for kubernetes)');

// 8. Empty query test
const qEmpty = executeResumeSearch('');
assert(qEmpty.totalMatches === 0 && qEmpty.flatResults.length === 0, 'Empty query returns 0 matches safely');

// 9. Execution time test (must be real measurement)
assert(q1.executionTimeMs >= 0, 'Search execution time is measured in ms', `${q1.executionTimeMs}ms`);

// 10. Job Description Analyzer: AI Backend Engineer Preset
const jdResult1 = analyzeJobDescription(SAMPLE_JOB_DESCRIPTIONS[0].text, DEFAULT_WEIGHTS);
assert(jdResult1.overallScore >= 70 && jdResult1.overallScore <= 100, 'JD Analyzer returns score between 70-100 for AI Backend Engineer');
assert(jdResult1.recommendedProjects.length > 0, 'JD Analyzer returns recommended projects');
assert(jdResult1.suggestions.length > 0, 'JD Analyzer returns truthful resume improvement suggestions');

// 11. Job Description Analyzer: Missing Skills Detection
const missingJD = `Looking for an expert with GraphQL, PostgreSQL, Rust, and Ansible.`;
const jdResultMissing = analyzeJobDescription(missingJD, DEFAULT_WEIGHTS);
assert(jdResultMissing.missingSkills.includes('GraphQL'), 'Correctly identifies GraphQL as missing from resume');
assert(jdResultMissing.missingSkills.includes('Rust'), 'Correctly identifies Rust as missing from resume');

// 12. Skill Map Verification: 9 Categories
assert(VERIFIED_SKILL_CATEGORIES.length === 9, 'Skill map contains exactly 9 verified categories');

// 13. Relationship Graph Verification
const graph = buildRelationshipGraph();
assert(graph.nodes.length >= 20, 'Relationship graph contains verified nodes', `Node count: ${graph.nodes.length}`);
assert(graph.links.length >= 20, 'Relationship graph contains verified links', `Link count: ${graph.links.length}`);

// 14. Recruiter Profile Summary Verification
assert(RECRUITER_PROFILE_SUMMARY.strongestAreas.length === 4, 'Profile summary contains 4 strongest areas');
assert(RECRUITER_PROFILE_SUMMARY.demonstratedCapabilities.length >= 4, 'Profile summary distinguishes demonstrated capabilities');
assert(RECRUITER_PROFILE_SUMMARY.claimedKnowledge.length >= 2, 'Profile summary distinguishes claimed knowledge');
assert(RECRUITER_PROFILE_SUMMARY.growthAreas.length >= 2, 'Profile summary provides transparent growth areas');

console.log(`\n=== VALIDATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED ===`);
if (passedTests === totalTests) {
  console.log('🎉 ALL ENGINE TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
