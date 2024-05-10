import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { getDefaultDocumentNode } from "./config/structure";
import { schemaTypes } from "./schemas";
import { codeInput } from "@sanity/code-input";
import { nbNOLocale } from "@sanity/locale-nb-no";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET!;

export default defineConfig({
  name: "capra-web",
  title: "Capra web",
  projectId,
  dataset,
  plugins: [
    nbNOLocale(),
    codeInput({
      codeModes: [
        {
          name: "vue",
          loader: () => import("@codemirror/lang-vue").then(({ vue }) => vue()),
        },
      ],
    }),
    structureTool({ title: "Struktur", defaultDocumentNode: getDefaultDocumentNode }),
    presentationTool({
      title: "Presentasjon",
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:5173",
        previewMode: {
          enable: "/preview/enable",
          disable: "/preview/disable",
        },
      },
    }),

    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
