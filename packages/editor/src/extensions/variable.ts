import { Mark, mergeAttributes } from "@tiptap/core"

export interface VariableInfo {
  name: string
  label: string
  description: string
}

export const AVAILABLE_VARIABLES: VariableInfo[] = [
  {
    name: "client_name",
    label: "Client Name",
    description: "Client's full name",
  },
  {
    name: "client_company",
    label: "Client Company",
    description: "Client's company name",
  },
  {
    name: "project_name",
    label: "Project Name",
    description: "Proposal title",
  },
  {
    name: "date",
    label: "Today's Date",
    description: "Current date",
  },
  {
    name: "total",
    label: "Total Amount",
    description: "Grand total from pricing table",
  },
]

export function getVariableLabel(name: string): string {
  const variable = AVAILABLE_VARIABLES.find((v) => v.name === name)
  return variable?.label ?? name
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (name: string) => ReturnType
    }
  }
}

export const Variable = Mark.create({
  name: "variable",

  inclusive: false,

  spanning: false,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-variable"),
        renderHTML: (attributes) => ({
          "data-variable": attributes.name as string,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "variable-chip",
      }),
      0,
    ]
  },

  addCommands() {
    return {
      insertVariable:
        (name: string) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: "text",
              text: `{{${name}}}`,
              marks: [
                {
                  type: "variable",
                  attrs: { name },
                },
              ],
            })
            .insertContent({
              type: "text",
              text: " ",
            })
            .run()
        },
    }
  },
})
