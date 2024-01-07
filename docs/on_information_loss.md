## Annotations on loss of information

The 'useTable' node doesn't load the ENTIRE table, but only the one that is currently active in memory in the 'EndpointWriter' object.

Should it, though?

Maybe yes, in which case I have to update the error messages to make that fact clear, Because if I don't do it that way then I lose information and then have to spend resources to retrieve it, so it makes sense for each records source to have all the information at hand and store it by calling related make table functions. And if any table on another table that has created previously then I need to create a specific make table function for that source that includes the information needed. Basically there is no analyzing previously stored data to try to scrape info back, that is inneficient. Information is simply lost.

However, in some cases there is no need for source information. For example for the companyToolDate table, which simply needs all the tools so that it can get their name and count mentions on Linkedin. Another example is the companyDate table, which needs all the companies so that it can search the specific information it needs. In those cases it is enough to just allow a `readFile` on the outputTable, making sure that all the sources for that table have finished the record merge.

Another potential issue is that there may be too many records loaded in RAM, so the architecture should control the flow of information from the scrapers and pause temporarily while saving the current obtained records before making space for the extra records.