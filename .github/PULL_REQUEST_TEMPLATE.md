## Checklist for completing pull request:
- [ ] Update Changelog.json if any functionality has been changed for the end user.
- [ ] Test functionality on Mobile and Web
- [ ] On mobile, check for warnings / errors in expo dev mode. If we add automated testing we can remove this from the checklist.
- [ ] Verify that any tests for new functionality are created and functional.
- [ ] SudokuBoard state should only directly be updated in SudokuBoard.tsx file (usage of setSudokuBoard() function)
- [ ] If needed, update the Readme