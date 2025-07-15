# PowerShell script to help create GitHub issues
# This script will open your GitHub repository and provide instructions

Write-Host "🚀 Creating GitHub Issues for GuhuzaQuizApp" -ForegroundColor Green
Write-Host ""

# Open GitHub repository
Write-Host "Opening GitHub repository..." -ForegroundColor Yellow
Start-Process "https://github.com/okenwa/GuhuzaQuiz/issues/new"

Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Cyan
Write-Host "1. The GitHub repository should now be open in your browser"
Write-Host "2. Copy and paste the issue content from ISSUES_TEMPLATES.md"
Write-Host "3. Add appropriate labels"
Write-Host "4. Submit the issue"
Write-Host ""

Write-Host "🎯 Recommended Order to Create Issues:" -ForegroundColor Magenta
Write-Host "1. Issue 3: Security - Environment Variables (High Priority)"
Write-Host "2. Issue 10: Testing Implementation (High Priority)"
Write-Host "3. Issue 2: Audio Error Handling (Medium Priority)"
Write-Host "4. Issue 1: Remove Debug Console Logs (Low Priority - Good for beginners)"
Write-Host "5. Issue 8: Code Cleanup and Refactoring (Medium Priority)"
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "- Start with high-priority issues first"
Write-Host "- Use the 'good first issue' label for beginner-friendly tasks"
Write-Host "- Assign issues to team members if working with others"
Write-Host "- Use milestones to group related issues"
Write-Host ""

Write-Host "✅ The ISSUES_TEMPLATES.md file contains all 15 issue templates ready to copy and paste!"
Write-Host ""

Read-Host "Press Enter to continue..." 