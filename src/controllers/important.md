Basically, instead of programming the table to have different registries, i just have one and then use pipelines to insert into the data warehouse the different version updates, using a technical key.

That way, instead of having logic to process everything down to one database, I just use pipelines to extract from the different processed tables into the final data warehouse. If I don't dothat, then i will do pipelining in raw JS, which is not wanted.

although it would probably be a good idea to simply use the pipelining to add extra versions of registers, instead of the whole processing there.
