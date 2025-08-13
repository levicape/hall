CREATE INDEX tarrasq_tasks_idx_gsi1 ON public.tarrasq_tasks
USING btree (gsi1_pk___tenant, pk);

CREATE VIEW public.tarrasq_tasks_by_gsi1 AS
SELECT
	*
FROM
	tarrasq_tasks tasks
ORDER BY
	tasks.gsi1_pk___tenant,
	tasks.pk;

CREATE INDEX tarrasq_runs_idx_gsi1 ON public.tarrasq_runs
USING btree (gsi1_pk___tenant, pk);

CREATE VIEW public.tarrasq_runs_by_gsi1 AS
SELECT
	*
FROM
	tarrasq_runs runs
ORDER BY
	runs.gsi1_pk___tenant,
	runs.pk;