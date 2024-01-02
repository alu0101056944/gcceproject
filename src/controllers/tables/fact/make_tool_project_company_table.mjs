/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Make tool_project_company table
 * 
 */

export default function makeToolProjectCompanyTable(toolTable,
    projectTable, companyTable) {
  const allRecord = [];

  for (const toolRecord of toolTable) {
    for (const projectRecord of projectTable) {
      if (toolRecord.name === projectRecord.project_name) {
        for (const companyRecord of companyTable) {
          if (toolRecord.author_company === companyRecord.name) {
            allRecord.push({
              tool_id: toolRecord.tool_id,
              project_id: projectRecord.project_id,
              company_id: companyRecord.company_id,
            });
          }
        }
      }
    }
  }

  return allRecord;
}
