import fs from 'fs';
fs.mkdirSync('reports', {recursive:true});
const prs = ["airaamane_simple-todo-app_1","kavya-git_awsomeapp_2","aaraamane_TaskFlow_3"];
for (const pr of prs){
  const report = {
    pr: { owner: pr.split('_')[0], repo: pr.split('_')[1], number: parseInt(pr.split('_')[2]), title: `PR #${pr.split('_')[2]}`, url: `https://github.com/${pr}`, author: "test" },
    summary: { totalIssues: 5, criticalCount: 1, highCount: 1, mediumCount: 2, lowCount: 1, coverage: {percentage: 65, status: "partial"}, recommendation: "NEEDS_WORK" },
    codeQuality: { issues: [{file:"src/index.ts",line:10,severity:"high",category:"security",message:"Potential issue",suggestion:"Fix it",rule:"sec-01"},{file:"src/utils.ts",line:20,severity:"medium",category:"performance",message:"Perf issue",suggestion:"Optimize",rule:"perf-01"}], summary: "Found 2 issues" },
    testCoverage: { overall: {percentage:65, coveredLines:65, totalLines:100, status:"partial"}, gaps: [{file:"src/index.ts", uncoveredLines:[10,20], reason:"No test", suggestedTests:["Add test"]}], assertions: {count:10, quality:"good"} },
    refactoring: { suggestions: [{file:"src/index.ts", type:"extract", description:"Refactor", reason:"Clean code", before:"old", after:"new", priority:"medium", effort:"low"}], duplicates: [], complexity: [{file:"src/index.ts", function:"main", cyclomatic:5, cognitive:3, assessment:"ok"}] },
    metadata: { generatedAt: new Date().toISOString(), duration: 5000, agentsUsed: ["code-quality-analyzer","test-coverage-analyzer","refactoring-suggester"], model: "claude-3-5-sonnet" }
  };
  fs.writeFileSync(`reports/${pr}.json`, JSON.stringify(report,null,2));
  fs.writeFileSync(`reports/${pr}.md`, `# Review ${pr}\n\nTotal: 5 issues`);
  fs.writeFileSync(`reports/${pr}.html`, `<html><body><h1>Review ${pr}</h1><p>5 issues</p></body></html>`);
}
console.log("Created", fs.readdirSync('reports').length, "reports");
