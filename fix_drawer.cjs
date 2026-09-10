const fs = require('fs');
let content = fs.readFileSync('src/components/people-ai/Employee360Drawer.tsx', 'utf8');
content = content.replace("  if (!open || !employee) return null;\n\n  const { data: intel, isLoading } = useGetEmployee360IntelligenceQuery(\n    { employeeId: employee.id, employees: allEmployees },\n    { skip: !employee?.id }\n  );", "  const skipQuery = !open || !employee?.id;\n  const { data: intel, isLoading } = useGetEmployee360IntelligenceQuery(\n    { employeeId: employee?.id || '', employees: allEmployees },\n    { skip: skipQuery }\n  );\n\n  if (!open || !employee) return null;");
fs.writeFileSync('src/components/people-ai/Employee360Drawer.tsx', content);
