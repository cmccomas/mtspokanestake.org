Each `.yaml` file in this folder becomes its own page under /resources.
The file name becomes the web address, e.g. `cleaning-schedule.yaml` → /resources/cleaning-schedule.

```yaml
title: Building Cleaning Schedule
description: Which ward cleans the stake center each week.
order: 10            # optional; lower numbers list first
columns: [Week of, Ward, Contact]
rows:
  - ["2026-11-02", Greenbluff Ward, Brother Smith]
  - ["2026-11-09", West Valley Ward, Sister Doe]
```

Every row must have exactly as many cells as there are columns.
