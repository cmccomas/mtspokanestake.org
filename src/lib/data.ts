// Loads and validates every YAML file in src/data.
// A file that doesn't match its schema throws here, which fails `npm run build`,
// so a bad edit never reaches the live site.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "astro/zod";

const DATA_DIR = path.resolve("src/data");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "dates must be written YYYY-MM-DD, e.g. 2026-11-08");
const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();

const siteSchema = z.object({
  name: text,
  tagline: optionalText,
  announcement: optionalText,
  stakeCenter: z
    .object({ name: optionalText, address: optionalText })
    .optional(),
  contactEmail: z.string().email().optional(),
});

const wardsSchema = z.array(
  z.object({
    name: text,
    meetingTime: optionalText,
    building: optionalText,
    address: optionalText,
  }),
);

const eventsSchema = z.array(
  z.object({
    date: isoDate,
    endDate: isoDate.optional(),
    title: text,
    time: optionalText,
    location: optionalText,
    details: optionalText,
  }),
);

const speakingSchema = z.array(
  z.object({
    date: isoDate,
    ward: text,
    // Leave speakers empty ([]) only for a ward with no stake speaker that Sunday
    // (e.g. its ward conference month); notes then says why.
    speakers: z.array(text).default([]),
    topic: optionalText,
    notes: optionalText,
  }).refine((a) => a.speakers.length > 0 || a.notes, {
    message: "needs at least one speaker, or notes saying why there is none (e.g. ward conference)",
  }),
);

const assignmentSchema = z.object({ role: text, name: text });

const conferencesSchema = z.array(
  z.object({
    name: text,
    date: isoDate,
    endDate: isoDate.optional(),
    theme: optionalText,
    location: optionalText,
    notes: optionalText,
    sessions: z
      .array(
        z.object({
          name: text,
          date: isoDate.optional(),
          time: optionalText,
          location: optionalText,
          assignments: z.array(assignmentSchema).default([]),
        }),
      )
      .default([]),
  }),
);

const highCouncilSchema = z.array(
  z.object({
    name: text,
    wards: z.array(text).default([]),
    stewardships: z.array(text).default([]),
    notes: optionalText,
  }),
);

const tableSchema = z
  .object({
    title: text,
    description: optionalText,
    order: z.number().default(100),
    columns: z.array(text).min(1),
    rows: z.array(z.array(z.union([z.string(), z.number()]).nullable())).default([]),
  })
  .superRefine((t, ctx) => {
    t.rows.forEach((row, i) => {
      if (row.length !== t.columns.length) {
        ctx.addIssue({
          code: "custom",
          path: ["rows", i],
          message: `row has ${row.length} cells but there are ${t.columns.length} columns`,
        });
      }
    });
  });

function load<T extends z.ZodTypeAny>(file: string, schema: T): z.output<T> {
  const full = path.join(DATA_DIR, file);
  // JSON_SCHEMA keeps dates and times like 10:00 as plain text instead of converting them.
  const raw = yaml.load(fs.readFileSync(full, "utf8"), { schema: yaml.JSON_SCHEMA }) ?? [];
  const result = schema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  - ${i.path.join(" > ") || "(top level)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Problem in src/data/${file}:\n${problems}`);
  }
  return result.data;
}

const byDate = <T extends { date: string }>(a: T, b: T) => a.date.localeCompare(b.date);

export const getSite = () => load("site.yaml", siteSchema);
export const getWards = () => load("wards.yaml", wardsSchema);
export const getEvents = () => load("events.yaml", eventsSchema).sort(byDate);
export const getSpeaking = () => load("speaking.yaml", speakingSchema).sort(byDate);
export const getConferences = () => load("stake-conference.yaml", conferencesSchema).sort(byDate);
export const getHighCouncil = () => load("high-council.yaml", highCouncilSchema);

export type Table = z.output<typeof tableSchema> & { slug: string };

export function getTables(): Table[] {
  const dir = path.join(DATA_DIR, "tables");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => ({ ...load(`tables/${f}`, tableSchema), slug: f.replace(/\.yaml$/, "") }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
