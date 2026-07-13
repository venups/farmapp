# Errors and Failures

## Backend Test Results: ALL PASSING

Total tests: 47
Passed: 47  
Failed: 0
Warnings: 2 (pytest fixture deprecation)

Test Categories:
- Auth endpoint tests: 11/11 passed
- Health endpoint tests: 2/2 passed
- Helper utility tests: 4/4 passed
- Security utility tests: 5/5 passed
- Trip endpoint tests: 9/9 passed
- Validation tests: 16/16 passed

Known Limitations:
- Auth headers use hardcoded user ID
- Tests handle database-connected and standalone scenarios

Fixes Applied:
1. bcrypt 4.3.0 for passlib compatibility
2. Password validation in UserRegister schema
3. Date validation in TripCreate schema
4. Composite build enabled in tsconfig.node.json

## Frontend: PRE-EXISTING BUILD ERRORS

92 TypeScript errors including:
- Re-declared variable handleDeleteActivity
- Missing @/types module
- Missing react-hook-form dependency
- DOM API type mismatches

Build fails due to pre-existing bugs.
