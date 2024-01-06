/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Make tool_project_company table
 * 
 */

export default function makeToolProjectCompanyTable(toolTable,
    projectTable, companyTable) {
  const allRecord = [];

  for (let i = 0; i < toolTable.length; i++) {
    allRecord.push({
      tool_id: toolTable[i].tool_id,
      project_id: projectTable[i].project_id,
      company_id: companyTable[i].company_id,
    });
  }

  return allRecord;
}
